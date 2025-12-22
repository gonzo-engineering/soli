import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import 'dotenv/config';
import { STRIPE_API_VERSION, TABLES } from '../../shared/config';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY;
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !STRIPE_KEY) {
	console.error('Missing environment variables');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const stripe = new Stripe(STRIPE_KEY, {
	apiVersion: STRIPE_API_VERSION
});

// Always pay midnight UTC → midnight UTC
const periodEnd = new Date();
// Add an extra day for testing purposes
periodEnd.setUTCDate(periodEnd.getUTCDate() + 1);
periodEnd.setUTCHours(0, 0, 0, 0);

const periodStart = new Date(periodEnd);
periodStart.setUTCDate(periodEnd.getUTCDate() - 7);

console.log(`Running payroll for period ${periodStart.toISOString()} → ${periodEnd.toISOString()}`);

// 1. Create payout record (acts as a lock)
const { data: payout, error: payoutError } = await supabase
	.from(TABLES.payouts)
	.insert({
		period_start: periodStart.toISOString(),
		period_end: periodEnd.toISOString(),
		status: 'pending'
	})
	.select()
	.single();

if (payoutError) {
	console.error('Failed to create payout record (already run?)', payoutError);
	process.exit(1);
}

// 2. Fetch unpaid earnings for the period (and before for carry-overs)
const { data: ledgerRows, error: ledgerError } = await supabase
	.from(TABLES.earningsLedger)
	.select('id, artist_id, tokens_earned')
	.is('payout_id', null)
	.lt('earned_at', periodEnd.toISOString());

if (ledgerError) {
	console.error('Error fetching earnings ledger', ledgerError);
	process.exit(1);
}

if (!ledgerRows || ledgerRows.length === 0) {
	console.log('No earnings to pay out for this period');
	await supabase.from(TABLES.payouts).update({ status: 'paid' }).eq('id', payout.id);
	process.exit(0);
}

// 3. Aggregate earnings by artist
const earningsByArtist = ledgerRows.reduce<Record<string, { total: number; ledgerIds: string[] }>>(
	(acc, row) => {
		if (!acc[row.artist_id]) {
			acc[row.artist_id] = { total: 0, ledgerIds: [] };
		}
		acc[row.artist_id].total += row.tokens_earned;
		acc[row.artist_id].ledgerIds.push(row.id);
		return acc;
	},
	{}
);

// 4. Fetch artist payout details
const artistIds = Object.keys(earningsByArtist);

const { data: artists, error: artistError } = await supabase
	.from(TABLES.artists)
	.select('id, name, stripe_account_id')
	.in('id', artistIds);

if (artistError || !artists) {
	console.error('Error fetching artists', artistError);
	process.exit(1);
}

// 5. Payout rules
for (const artist of artists) {
	const earnings = earningsByArtist[artist.id];
	if (!earnings) continue;

	if (!artist.stripe_account_id) {
		console.warn(`Skipping ${artist.name}: no Stripe account`);
		continue;
	}

	try {
		// 6. Send Stripe transfer
		const transfer = await stripe.transfers.create({
			amount: earnings.total,
			currency: 'gbp',
			destination: artist.stripe_account_id,
			description: `Weekly payout ${periodStart.toLocaleDateString()}–${periodEnd.toLocaleDateString()}`,
			metadata: {
				payout_id: payout.id,
				artist_id: artist.id
			}
		});

		console.log(`Paid £${(earnings.total / 100).toFixed(2)} to ${artist.name}`);

		// 7. Mark ledger rows as paid
		const { error: ledgerUpdateError } = await supabase
			.from(TABLES.earningsLedger)
			.update({ payout_id: payout.id })
			.in('id', earnings.ledgerIds);

		if (ledgerUpdateError) {
			console.error(`Ledger update failed for ${artist.name}`, ledgerUpdateError);
			throw ledgerUpdateError;
		}
	} catch (err) {
		console.error(`Failed paying ${artist.name}`, err);
	}
}

// 8. Finalise payout record
await supabase.from(TABLES.payouts).update({ status: 'paid' }).eq('id', payout.id);

console.log('Payroll complete');
