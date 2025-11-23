import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import 'dotenv/config';

interface Stream {
	id: string;
	streamed_at: string;
	user_id: string;
	track_id: string;
	artist_id: string;
	tokens_used: number;
}

const PUBLIC_SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const PUBLIC_SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY;
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY || !STRIPE_KEY) {
	console.error('Missing environment variables');
	process.exit(1);
}

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

const { data, error } = await supabase.from('streams').select();

if (error) {
	console.error('Error fetching streams:', error);
}

if (!data) {
	console.error('No data found');
	process.exit(1);
}

// TODO: Make this more robust, and possibly going from midnight to midnight
// ending before the script runs to avoid double counting
const today = new Date();
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(today.getDate() - 7);

const streamsFromLastSevenDays: Stream[] = data.filter((stream) => {
	const streamDate = new Date(stream.streamed_at);
	return streamDate >= sevenDaysAgo && streamDate < today;
});

const artistEarnings = streamsFromLastSevenDays.reduce<
	Record<string, { total_streams: number; total_earnings: number }>
>((acc, stream) => {
	const { artist_id, tokens_used } = stream;
	if (!acc[artist_id]) {
		acc[artist_id] = {
			total_streams: 0,
			total_earnings: 0
		};
	}
	acc[artist_id].total_streams += 1;
	acc[artist_id].total_earnings += tokens_used;
	return acc;
}, {});

// Use each key to get the artist name and strip_account_id
const artistIds = Object.keys(artistEarnings);
const { data: artists, error: artistError } = await supabase
	.from('artists')
	.select('id, name, stripe_account_id')
	.in('id', artistIds);
if (artistError) {
	console.error('Error fetching artists:', artistError);
	process.exit(1);
}
if (!artists) {
	console.error('No artists found');
	process.exit(1);
}

const artistEarningsWithNames = artistIds.map((artistId) => {
	const artist = artists.find((artist) => artist.id === artistId);
	if (!artist) {
		console.error(`Artist with id ${artistId} not found`);
		return null;
	}
	const { name, stripe_account_id } = artist;
	const { total_streams, total_earnings } = artistEarnings[artistId];
	return {
		artist_name: name,
		artist_id: artistId,
		stripe_id: stripe_account_id,
		total_streams_for_period: total_streams,
		total_earnings_for_period: total_earnings
	};
});

// Send a payout to each artist
export const stripe = new Stripe(STRIPE_KEY, {
	apiVersion: '2025-11-17.clover'
});

const prettifyPennies = (pence: number) => {
	const pounds = Math.floor(pence / 100);
	const pennies = pence % 100;
	return `£${pounds}.${pennies < 10 ? '0' : ''}${pennies}`;
};

const payoutPromises = artistEarningsWithNames.map(async (artist) => {
	if (!artist) {
		console.error('Artist not found');
		return;
	}
	const { stripe_id, total_earnings_for_period } = artist;
	if (!stripe_id) {
		console.error(`Stripe ID for artist ${artist.artist_name} not found`);
		return;
	}
	try {
		const payout = await stripe.transfers.create({
			amount: total_earnings_for_period,
			currency: 'gbp',
			destination: stripe_id,
			description: `Payout for ${
				artist.artist_name
			} for the period of ${sevenDaysAgo.toLocaleDateString()} to ${today.toLocaleDateString()}`
		});
		console.log(
			`Payout of ${prettifyPennies(total_earnings_for_period)} sent to ${
				artist.artist_name
			} (${stripe_id})`
		);
	} catch (error) {
		console.error(`Error sending payout to ${artist.artist_name} (${stripe_id}):`, error);
	}
});
await Promise.all(payoutPromises);

console.log('Payroll complete');

// Send a notification to each artist?

// Send notifications to listeners telling them where their money went?
