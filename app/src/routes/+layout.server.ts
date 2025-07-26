// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import type { UserProfile } from '../../../shared/types';
import { TABLES } from '$lib/global/config';

export const load: LayoutServerLoad = async ({ locals: { supabase, safeGetSession }, cookies }) => {
	const { session, user } = await safeGetSession();

	let profileData = null;

	if (session) {
		const {
			data: profile
		}: {
			data: UserProfile | null;
		} = await supabase
			.from(TABLES.users)
			.select(`first_name, tokens_balance, pay_per_stream`)
			.eq('id', session.user.id)
			.single();
		profileData = profile;
	}

	return {
		session,
		user,
		profileData,
		cookies: cookies.getAll()
	};
};
