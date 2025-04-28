import { getManifests, pinata } from '$lib/server/pinata';
import type { ArtistManifest } from '$lib/types/index.js';

// TODO: Explore static generation where possible to
// improve performance and keep requests to a minimum

export const entries = async () => {
	const manifests = await getManifests();
	const slugs = manifests.map((manifest) => {
		return { slug: manifest.artist.id };
	});
	return slugs;
};

export const load = async ({ fetch, params }) => {
	const manifests: ArtistManifest[] = await fetch('/api/artists').then((res) => res.json());

	const matchingArtist = manifests.find((artist) => artist.artist.id === params.slug);

	if (!matchingArtist) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}

	const artistWithLinks = await Promise.all(
		matchingArtist.releases.map(async (release) => {
			const coverLink = await pinata.gateways.public.convert(release.cover_cid);
			return {
				...release,
				coverLink
			};
		})
	);

	const artistImageLink = await pinata.gateways.public.convert(matchingArtist.artist.image_cid);

	return {
		artistManifest: {
			...matchingArtist,
			artist: {
				...matchingArtist.artist,
				imageLink: artistImageLink
			},
			releases: artistWithLinks
		}
	};
};
