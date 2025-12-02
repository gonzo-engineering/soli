import type { LayoutServerLoad } from './$types';
import type { Collection, Mixtape } from '../../../shared/types/core';
import { API_BASE } from '$lib/global/config';
import type { Listener } from '../../../shared/types/core';
import type { TrackHydrated } from '../../../shared/types/hydrated';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies, fetch }) => {
	const { session, user } = await safeGetSession();

	let profileData: Listener | null = null;
	let collections: Collection[] = [];
	let likedTracks: TrackHydrated[] = [];
	let followedIDs: string[] = [];
	let mixtapes: Mixtape[] = [];

	const userId = session?.user.id;

	if (session && userId) {
		profileData = await fetch(`${API_BASE}/users/${userId}`).then((res) => res.json());
		collections = await fetch(`${API_BASE}/users/${userId}/collections`).then((res) => res.json());
		likedTracks = await fetch(`${API_BASE}/users/${userId}/likes`).then((res) => res.json());
		followedIDs = await fetch(`${API_BASE}/users/${userId}/following`).then((res) => res.json());
		mixtapes = await fetch(`${API_BASE}/users/${userId}/mixtapes`).then((res) => res.json());
	}

	return {
		session,
		user,
		profileData,
		collections,
		likedTracks,
		mixtapes,
		followedArtists: followedIDs,
		cookies: cookies.getAll()
	};
};
