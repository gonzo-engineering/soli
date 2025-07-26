import type { ArtistRaw } from '../../../../shared/types';

export const load = async ({ fetch }) => {
	const artists: ArtistRaw[] = await fetch('/api/artists').then((res) => res.json());

	return {
		artists
	};
};
