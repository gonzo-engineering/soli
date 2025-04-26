import type { ArtistHydrated, ReleaseHydrated } from '$lib/types/index.js';

export const load = async ({ fetch }) => {
	const releases: ReleaseHydrated[] = await fetch('/api/releases').then((res) => res.json());
	const artists: ArtistHydrated[] = await fetch('/api/artists').then((res) => res.json());

	return {
		releases,
		artists
	};
};
