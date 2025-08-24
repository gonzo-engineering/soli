import type { LayoutServerLoad } from './$types';
import type { UserProfile } from '../../../shared/types';
import { TABLES } from '$lib/global/config';

export const load: LayoutServerLoad = async ({ locals: { supabase, safeGetSession }, cookies }) => {
	const { session, user } = await safeGetSession();

	let profileData = null;
	let favourites: string[] = [];

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
		const {
			data: favs
		}: {
			data: { track_id: string }[] | null;
		} = await supabase.from(TABLES.likedTracks).select(`track_id`).eq('user_id', session.user.id);
		favourites = favs?.map((fav) => fav.track_id) ?? [];
	}

	return {
		session,
		user,
		profileData,
		favourites,
		cookies: cookies.getAll()
	};
};
