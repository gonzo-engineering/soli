import { pinata } from '$lib/server/pinata';
import type { ArtistManifest, Release } from '$lib/types/index.js';

export const load = async ({ fetch, params }) => {
	const releases: Release[] = await fetch('/api/releases').then((res) => res.json());

	const matchingRelease = releases.find((release) => release.id === params.slug);

	if (!matchingRelease) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}

	const artistManifests: ArtistManifest[] = await fetch(`/api/artists`).then((res) => res.json());

	const artistManifest = artistManifests.find(
		(manifest) => manifest.artist.name === matchingRelease.artistName
	);

	if (!artistManifest) {
		return {
			status: 404,
			error: new Error('Artist Not Found')
		};
	}

	const coverLink = await pinata.gateways.public.convert(matchingRelease.cover_cid);
	const tracksWithLinks = await Promise.all(
		matchingRelease.tracks.map(async (track) => {
			const url = await pinata.gateways.public.convert(track.cid);
			return {
				...track,
				url
			};
		})
	);
	const releaseWithLinks = {
		...matchingRelease,
		coverLink,
		tracks: tracksWithLinks
	};

	return {
		release: releaseWithLinks,
		artistManifest
	};
};
