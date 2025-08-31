import type { ArtistRaw, ReleaseHydrated } from '../../../shared/types';

export const load = async ({ fetch }) => {
	const artists: ArtistRaw[] = await fetch('/api/artists').then((res) => res.json());
	const releases: ReleaseHydrated[] = await fetch('/api/releases').then((res) => res.json());

	return {
		artists,
		releases
	};
};
