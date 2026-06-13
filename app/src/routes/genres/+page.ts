import { API_BASE } from '$lib/global/config';
import type { ReleaseHydrated } from '@soli/shared/types/hydrated';

export const load = async ({ fetch }) => {
	const releases: ReleaseHydrated[] = await fetch(`${API_BASE}/releases`).then((res) => res.json());

	const genres = releases.flatMap((release) => release.genres || []);
	const uniqueGenres = Array.from(new Set(genres));

	return {
		genres: uniqueGenres
	};
};
