import { API_BASE } from '$lib/global/config';
import type { ReleaseHydrated } from '../../../../../shared/types/hydrated';

export const load = async ({ params, fetch }) => {
	const releases: ReleaseHydrated[] = await fetch(`${API_BASE}/releases`).then((res) => res.json());

	const genres = releases.flatMap((release) => release.genres || []);
	const uniqueGenres = Array.from(new Set(genres));

	if (!uniqueGenres.includes(params.slug)) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}

	const filteredReleases = releases.filter((release) => release.genres?.includes(params.slug));

	return {
		genre: params.slug,
		genreReleases: filteredReleases
	};
};
