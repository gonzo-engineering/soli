import { API_BASE } from '$lib/global/config';
import type { ReleaseHydrated } from '../../../shared/types/hydrated';
import type { Artist } from '../../../shared/types/core';

export const load = async ({ data, fetch }) => {
	const artists: Artist[] = await fetch(`${API_BASE}/artists`).then((res) => res.json());
	const releases: ReleaseHydrated[] = await fetch(`${API_BASE}/releases`).then((res) => res.json());

	// Filter artists to only those who have releases
	const filteredArtists = artists.filter((artist) =>
		releases.some((release) => release.artist_id === artist.id)
	);

	return {
		artists: filteredArtists,
		releases
	};
};
