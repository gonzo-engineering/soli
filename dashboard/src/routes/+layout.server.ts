import type { LayoutServerLoad } from './$types';
import type { ArtistHydrated } from '../../../shared/types/hydrated';
import { API_BASE, REQUEST_HEADER_BOILERPLATE } from '$lib/config';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
	const { session, user } = await safeGetSession();

	if (!session || !user) {
		return {
			session,
			user,
			cookies: cookies.getAll(),
			artists: [],
			songs: [],
			streams: []
		};
	}

	const userID = session.user.id;

	const connectedArtists: ArtistHydrated[] = await fetch(`${API_BASE}/users/${userID}/artists`, {
		method: 'GET',
		headers: REQUEST_HEADER_BOILERPLATE
	}).then((res) => res.json());

	connectedArtists.sort((a, b) => {
		if (a.name < b.name) return -1;
		if (a.name > b.name) return 1;
		return 0;
	});

	return {
		session,
		user,
		cookies: cookies.getAll(),
		artists: connectedArtists
	};
};
