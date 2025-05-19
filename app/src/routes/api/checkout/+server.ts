import { DOMAIN, REVENUE_SPLIT } from '$lib/global/config';
import { stripe } from '../../../lib/server/stripe';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const { userId, balance, topUpAmount } = data;
	const lineItem = {
		price_data: {
			currency: 'gbp',
			product_data: {
				name: `${Math.round(topUpAmount * REVENUE_SPLIT.artists)} streaming tokens`,
				images: []
			},
			unit_amount: topUpAmount
		},
		quantity: 1
	};

	const session = await stripe.checkout.sessions.create({
		line_items: [lineItem],
		mode: 'payment',
		metadata: {
			userId: userId,
			balance: balance
		},
		success_url: DOMAIN,
		cancel_url: DOMAIN
	});

	return new Response(JSON.stringify({ url: session.url, userId }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
