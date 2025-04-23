import type { Artist } from '$lib/types/index.js';

export const load = async ({ fetch }) => {
	const artists: Artist[] = await fetch('/api/artists').then((res) => res.json());

	return {
		artists
	};
};
