import { REVENUE_SPLIT } from '../../../../../shared/config';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const requestBody = await request.json();

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

	const response = await fetch(`/users/${userId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ balanceChange: topUpTokens })
	});

	if (!response.ok) {
		const errorBody = await response.json().catch(() => ({}));
		console.error('Error updating user balance:', errorBody);
		return new Response(JSON.stringify({ message: 'Error topping up balance', error: errorBody }), {
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
