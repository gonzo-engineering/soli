import type { ArtistRaw } from '../../../../../shared/types';
import { API_BASE } from '$lib/global/config';
import { sortReleasesByDate } from '../../../../../shared/utils';

export const load = async ({ params, fetch }) => {
	const matchingArtist: ArtistRaw = await fetch(`${API_BASE}/artists/${params.slug}`).then(
		(res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch artist with slug: ${params.slug}`);
			}
			return res.json();
		}
	);

	if (!matchingArtist) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}

	const artistReleases = await fetch(`${API_BASE}/artists/${params.slug}/releases`).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to fetch releases for artist with slug: ${params.slug}`);
		}
		return res.json();
	});

	return {
		artist: matchingArtist,
		releases: sortReleasesByDate(artistReleases)
	};
};
