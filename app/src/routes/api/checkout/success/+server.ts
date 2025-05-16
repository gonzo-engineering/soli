import { REVENUE_SPLIT, TABLES } from '$lib/global/config';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	const requestBody = await request.json();
	const stripeSession = requestBody.data.object;

	if (
		stripeSession.object === 'charge' &&
		stripeSession.paid &&
		stripeSession.status === 'succeeded'
	) {
		const userId = stripeSession.metadata.userId;
		const userTokensBalance = stripeSession.metadata.balance;
		const topUpAmount = stripeSession.amount_captured;
		const topUpTokens = Math.round(topUpAmount * REVENUE_SPLIT.artists);

		const { error } = await supabase
			.from(TABLES.users)
			.update({
				tokens_balance: topUpTokens + userTokensBalance
			})
			.eq('id', userId);
		if (error) {
			console.error('Error updating user balance:', error);
			return new Response(JSON.stringify({ message: 'Error topping up balance' }), { status: 500 });
		}
		console.log('User balance updated successfully.');
	}
	return new Response(JSON.stringify({ request }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
