import type { LayoutServerLoad } from './$types';
import type { LikedTrackObject, UserProfile } from '../../../shared/types';
import { API_BASE } from '$lib/global/config';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies, fetch }) => {
	const { session, user } = await safeGetSession();

	let profileData: UserProfile | null = null;
	let likedTracks: LikedTrackObject[] = [];
	let followedIDs: string[] = [];

	const userId = session?.user.id;

	if (session) {
		profileData = await fetch(`${API_BASE}/users/${userId}`).then((res) => res.json());
		likedTracks = await fetch(`${API_BASE}/users/${userId}/likes`).then((res) => res.json());
		followedIDs = await fetch(`${API_BASE}/users/${userId}/following`).then((res) => res.json());
	}

	console.log('Profile Data:', profileData);
	console.log('Liked Tracks:', likedTracks);
	console.log('Followed IDs:', followedIDs);

	return {
		session,
		user,
		profileData,
		likedTracks,
		followedArtists: followedIDs,
		cookies: cookies.getAll()
	};
};
