import { APP_DOMAIN } from '@soli/shared/config';
import { stripe } from '$lib/server/stripe';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const {
		userId,
		balance,
		topUpAmount
	}: {
		userId: string;
		balance: number;
		topUpAmount: number;
	} = data;
	const lineItem = {
		price_data: {
			currency: 'gbp',
			product_data: {
				name: `${Math.round(topUpAmount * 0.9)} streaming tokens`,
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
		success_url: APP_DOMAIN,
		cancel_url: APP_DOMAIN
	});

	return new Response(JSON.stringify({ url: session.url, userId }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
