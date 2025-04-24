import type { Artist, Release } from '$lib/types/index.js';

export const load = async ({ fetch, params }) => {
	const releases: Release[] = await fetch('/api/releases').then((res) => res.json());

	const matchingRelease = releases.find((release) => release.id === params.slug);

	if (!matchingRelease) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}

	const artists: Artist[] = await fetch('/api/artists').then((res) => res.json());
	const matchingArtist = artists.find((artist) => artist.id === matchingRelease.artistID);

	return {
		release: matchingRelease,
		artist: matchingArtist
	};
};
