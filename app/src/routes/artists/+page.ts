import { API_BASE } from '$lib/global/config';
import type { ReleaseHydrated } from '@soli/shared/types/hydrated';
import type { Artist } from '@soli/shared/types/core';

export const load = async ({ fetch }) => {
	const artists: Artist[] = await fetch(`${API_BASE}/artists`).then((res) => res.json());
	const releases: ReleaseHydrated[] = await fetch(`${API_BASE}/releases`).then((res) => res.json());

	const filteredArtists = artists.filter((artist) =>
		releases.some((release) => release.artist_id === artist.id)
	);

	return {
		artists: filteredArtists
	};
};
