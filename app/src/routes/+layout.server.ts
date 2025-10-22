import type { LayoutServerLoad } from './$types';
import type { Collection, LikedTrackObject, UserProfile } from '../../../shared/types';
import { API_BASE } from '$lib/global/config';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies, fetch }) => {
	const { session, user } = await safeGetSession();

	let profileData: UserProfile | null = null;
	let collections: Collection[] = [];
	let likedTracks: LikedTrackObject[] = [];
	let followedIDs: string[] = [];

	const userId = session?.user.id;

	if (session && userId) {
		profileData = await fetch(`${API_BASE}/users/${userId}`).then((res) => res.json());
		collections = await fetch(`${API_BASE}/users/${userId}/collections`).then((res) => res.json());
		likedTracks = await fetch(`${API_BASE}/users/${userId}/likes`).then((res) => res.json());
		followedIDs = await fetch(`${API_BASE}/users/${userId}/following`).then((res) => res.json());
	}

	return {
		session,
		user,
		profileData,
		collections,
		likedTracks,
		followedArtists: followedIDs,
		cookies: cookies.getAll()
	};
};
