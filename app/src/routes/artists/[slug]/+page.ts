import type { Artist, ReleaseHydrated } from '$lib/types/index.js';

export const load = async ({ fetch, params }) => {
	const artists: Artist[] = await fetch('/api/artists').then((res) => res.json());

	const matchingArtist = artists.find((artist) => artist.id === params.slug);

	if (!matchingArtist) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}

	const releases: ReleaseHydrated[] = await fetch('/api/releases').then((res) => res.json());

	const releasesByArtist = releases.filter((release) => release.artist.id === matchingArtist?.id);

	return {
		artist: matchingArtist,
		releases: releasesByArtist
	};
};
