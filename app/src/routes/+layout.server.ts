import type { LayoutServerLoad } from './$types';
import type { LikedTrackObject, UserProfile } from '../../../shared/types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies, fetch }) => {
	const { session, user } = await safeGetSession();

	let profileData: UserProfile | null = null;
	let likedTracks: LikedTrackObject[] = [];
	let followedIDs: string[] = [];

	if (session) {
		profileData = await fetch(`/api/users/${session.user.id}`).then((res) => res.json());
		likedTracks = await fetch(`/api/users/${session.user.id}/likes`).then((res) => res.json());
		followedIDs = await fetch(`/api/users/${session.user.id}/following`).then((res) => res.json());
	}

	return {
		session,
		user,
		profileData,
		likedTracks,
		followedArtists: followedIDs,
		cookies: cookies.getAll()
	};
};
