import type { LayoutServerLoad } from './$types';
import type {
	ArtistHydrated,
	CollectionHydrated,
	Listener,
	MixtapeHydrated,
	TrackHydrated
} from '@soli/shared/types';
import { API_BASE } from '$lib/global/config';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies, fetch }) => {
	const { session, user } = await safeGetSession();

	let profileData: Listener | null = null;
	let collections: CollectionHydrated[] = [];
	let likedTracks: TrackHydrated[] = [];
	let followedIDs: string[] = [];
	let mixtapes: MixtapeHydrated[] = [];
	let linkedArtists: ArtistHydrated[] = [];

	const userId = session?.user.id;

	if (session && userId) {
		profileData = await fetch(`${API_BASE}/users/${userId}`).then((res) => res.json());
		collections = await fetch(`${API_BASE}/users/${userId}/collections`).then((res) => res.json());
		likedTracks = await fetch(`${API_BASE}/users/${userId}/likes`).then((res) => res.json());
		followedIDs = await fetch(`${API_BASE}/users/${userId}/following`).then((res) => res.json());
		mixtapes = await fetch(`${API_BASE}/users/${userId}/mixtapes`).then((res) => res.json());
		linkedArtists = await fetch(`${API_BASE}/users/${userId}/artists`).then((res) => res.json());
	}

	return {
		session,
		user,
		profileData,
		collections,
		likedTracks,
		mixtapes,
		followedArtists: followedIDs,
		linkedArtists,
		cookies: cookies.getAll()
	};
};
