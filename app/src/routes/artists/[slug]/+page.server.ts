import { API_BASE } from '$lib/global/config';
import { error } from '@sveltejs/kit';
import type { Artist } from '../../../../../shared/types/core';
import { sortReleasesByDate } from '../../../../../shared/utils';
import type { ReleaseHydrated } from '../../../../../shared/types/hydrated';

export const load = async ({ params, fetch }) => {
	const matchingArtist: Artist = await fetch(`${API_BASE}/artists/${params.slug}`).then((res) => {
		if (!res.ok) {
			error(404, 'Artist not found');
		}
		return res.json();
	});

	const artistReleases: ReleaseHydrated[] = await fetch(
		`${API_BASE}/artists/${params.slug}/releases`
	).then((res) => {
		if (!res.ok) {
			error(500, 'Failed to fetch artist releases');
		}
		return res.json();
	});

	return {
		artist: matchingArtist,
		releases: sortReleasesByDate(artistReleases)
	};
};
