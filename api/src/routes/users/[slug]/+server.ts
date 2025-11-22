import { TABLES } from '../../../../../shared/config';
import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import { requireUserMatch } from '$lib/server/auth';
import type { User } from '../../../../../shared/types/core';

const getUser = async (id: string): Promise<User | null> => {
	const { data } = await supabase
		.from(TABLES.users)
		.select(`first_name, tokens_balance, pay_per_stream`)
		.eq('id', id)
		.single();
	return data;
};

export async function GET({ params, request, ...event }) {
	const maybeUserID = params.slug;

	// Verify user is authenticated and can only access their own data
	const authResult = await requireUserMatch(
		{ request, ...event } as any,
		maybeUserID
	);
	if (typeof authResult === 'object' && 'response' in authResult) {
		return authResult.response;
	}

	const profile = await getUser(maybeUserID);

	if (!profile) {
		return json({ error: 'User not found' }, { status: 404 });
	}

	return json(profile);
}

export async function PATCH({ request, params, ...event }) {
	const maybeUserID = params.slug;

	// Verify user is authenticated and can only modify their own data
	const authResult = await requireUserMatch(
		{ request, ...event } as any,
		maybeUserID
	);
	if (typeof authResult === 'object' && 'response' in authResult) {
		return authResult.response;
	}

	const profile = await getUser(maybeUserID);

	if (!profile) {
		return json({ error: 'User not found' }, { status: 404 });
	}

	const { tokens_balance } = profile;
	const { balanceChange, updateProfileInfo } = await request.json();

	if (updateProfileInfo) {
		const { first_name, pay_per_stream } = updateProfileInfo;
		const { error } = await supabase
			.from(TABLES.users)
			.update({
				first_name,
				pay_per_stream,
				updated_at: new Date()
			})
			.eq('id', maybeUserID);

		if (error) {
			console.error('Error updating user profile:', error);
			return json({ error: 'Failed to update user profile' }, { status: 500 });
		}

		return json({ message: 'User profile updated successfully' });
	}

	if (balanceChange) {
		const newBalance = tokens_balance + balanceChange;

		const { error } = await supabase
			.from(TABLES.users)
			.update({ tokens_balance: newBalance, updated_at: new Date() })
			.eq('id', maybeUserID)
			.select(`first_name, tokens_balance, pay_per_stream`)
			.single();

		if (error) {
			console.error('Error updating user profile:', error);
			return json({ error: 'Failed to update user profile' }, { status: 500 });
		}

		return json({ message: 'User balance updated successfully.' });
	}

	return json({ error: 'Invalid request' }, { status: 400 });
}
