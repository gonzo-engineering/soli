import type { ArtistRaw, ReleaseHydrated } from '$lib/types/index.js';

// TODO: Explore static generation where possible to
// improve performance and keep requests to a minimum

export const entries = async () => {
	const artists: ArtistRaw[] = await fetch('/api/artists').then((res) => res.json());
	const slugs = artists.map((artist) => {
		return { slug: artist.id };
	});
	return slugs;
};

export const load = async ({ params, fetch }) => {
	const artists: ArtistRaw[] = await fetch('/api/artists').then((res) => res.json());

	const matchingArtist = artists.find((artist) => artist.id === params.slug);

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
