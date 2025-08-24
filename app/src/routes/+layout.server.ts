import type { LayoutServerLoad } from './$types';
import type { UserProfile } from '../../../shared/types';
import { TABLES } from '$lib/global/config';

export const load: LayoutServerLoad = async ({ locals: { supabase, safeGetSession }, cookies }) => {
	const { session, user } = await safeGetSession();

	let profileData = null;
	let likedTrackIDs: string[] = [];

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
			data: likedTracks
		}: {
			data: { track_id: string }[] | null;
		} = await supabase.from(TABLES.likedTracks).select(`track_id`).eq('user_id', session.user.id);
		likedTrackIDs = likedTracks?.map((fav) => fav.track_id) ?? [];
	}

	return {
		session,
		user,
		profileData,
		likedTrackIDs,
		cookies: cookies.getAll()
	};
};
