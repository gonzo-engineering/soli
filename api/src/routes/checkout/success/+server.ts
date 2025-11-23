import { supabase } from '$lib/server/supabase';
import { REVENUE_SPLIT, TABLES } from '../../../../../shared/config';
import { type RequestHandler } from '@sveltejs/kit';
import { verifyStripeWebhookSignature } from '$lib/server/stripe';

export const POST: RequestHandler = async ({ request }) => {
	// Verify webhook signature to prevent replay attacks
	const signature = request.headers.get('stripe-signature');
	if (!signature) {
		console.error('Missing stripe-signature header');
		return new Response(JSON.stringify({ message: 'Missing signature' }), { status: 401 });
	}

	const rawBody = await request.text();
	let requestBody;
	try {
		requestBody = JSON.parse(rawBody);
	} catch (err) {
		console.error('Invalid JSON in request body');
		return new Response(JSON.stringify({ message: 'Invalid JSON' }), { status: 400 });
	}

	// Verify signature
	try {
		if (!verifyStripeWebhookSignature(signature, rawBody)) {
			console.error('Invalid stripe webhook signature');
			return new Response(JSON.stringify({ message: 'Invalid signature' }), { status: 401 });
		}
	} catch (err) {
		console.error('Webhook verification error:', err);
		return new Response(JSON.stringify({ message: 'Verification failed' }), { status: 500 });
	}

	if (requestBody.type !== 'checkout.session.completed') {
		console.log('Not a checkout session completed event');
		return new Response(JSON.stringify({ message: 'Not a checkout session completed event' }), {
			status: 400
		});
	}

	const stripeSession = requestBody.data.object;

	if (!stripeSession) {
		console.log('No stripe session found');
		return new Response(JSON.stringify({ message: 'No stripe session found' }), { status: 400 });
	}

	if (!stripeSession.metadata.userId || !stripeSession.metadata.balance) {
		console.log('No userId or balance found in metadata');
		return new Response(JSON.stringify({ message: 'No userId or balance found in metadata' }), {
			status: 400
		});
	}

	const userId: string = stripeSession.metadata.userId;
	const topUpAmount: number = stripeSession.amount_total;
	const topUpTokens = Math.round(topUpAmount * REVENUE_SPLIT.artists);
	// FIX: Parse balance as number first, then add - prevents string concatenation bug
	const currentBalance = parseInt(stripeSession.metadata.balance, 10);
	const newBalance = currentBalance + topUpTokens;

	const { error } = await supabase
		.from(TABLES.users)
		.update({
			tokens_balance: newBalance,
			updated_at: new Date()
		})
		.eq('id', userId)
		.select(`first_name, tokens_balance, pay_per_stream`)
		.single();

	if (error) {
		console.error('Error updating user balance:', error);
		return new Response(JSON.stringify({ message: 'Error topping up balance', error }), {
			status: 500
		});
	}

	console.log('User balance updated successfully.');

	return new Response(JSON.stringify({ request }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
