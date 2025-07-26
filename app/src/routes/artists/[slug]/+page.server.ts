import type { ArtistRaw, ReleaseHydrated } from '../../../../../shared/types';

// TODO: Explore static generation where possible to
// improve performance and keep requests to a minimum.
// May entail splitting the API into its own thing.

export const load = async ({ params, fetch }) => {
	const matchingArtist: ArtistRaw = await fetch(`/api/artists/${params.slug}`).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to fetch artist with slug: ${params.slug}`);
		}
		return res.json();
	});

	if (!matchingArtist) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}

	const allReleases: ReleaseHydrated[] = await fetch(`/api/releases`).then((res) => res.json());

	const artistReleases = allReleases.filter((release) => release.artist_id === matchingArtist.id);

	return {
		artist: matchingArtist,
		releases: artistReleases
	};
};
