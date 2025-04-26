import type { ArtistRaw } from '$lib/types/index.js';

export const load = async ({ fetch }) => {
	const artists: ArtistRaw[] = await fetch('/api/artists').then((res) => res.json());

	return {
		artists
	};
};
