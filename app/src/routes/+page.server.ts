import { pinata } from '$lib/server/pinata';
import type { ArtistManifest } from '$lib/types/index.js';

export const load = async ({ fetch }) => {
	const rawManifests: ArtistManifest[] = await fetch('/api/artists').then((res) => res.json());

	// Hydrate the manifests with image links and release artwork links
	const manifests = await Promise.all(
		rawManifests.map(async (manifest) => {
			const artistImageLink = await pinata.gateways.public.convert(manifest.artist.image_cid);
			const releasesWithLinks = await Promise.all(
				manifest.releases.map(async (release) => {
					const coverLink = await pinata.gateways.public.convert(release.cover_cid);
					return {
						...release,
						coverLink
					};
				})
			);
			return {
				...manifest,
				artist: {
					...manifest.artist,
					imageLink: artistImageLink
				},
				releases: releasesWithLinks
			};
		})
	);

	return {
		manifests
	};
};
