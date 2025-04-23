import type { Artist } from '$lib/types/index.js';

export const load = async ({ fetch, params }) => {
	const artists: Artist[] = await fetch('/api/artists').then((res) => res.json());

	const matchingArtist = artists.find((release) => release.id === params.slug);

	if (!matchingArtist) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}
	if (matchingArtist) {
		return {
			artist: matchingArtist
		};
	}
};
