// Returns all the releases from all the manifests

import { json } from '@sveltejs/kit';
import type { ArtistManifest, Release } from '$lib/types';
import { pinata, pinataGroups } from '$lib/server/pinata';

export async function GET() {
	const manifests = await pinata.files.public.list().group(pinataGroups.manifests);

	const allManifests = (await Promise.all(
		manifests.files.map(async (manifest) => {
			const { data } = await pinata.gateways.public.get(manifest.cid);
			return data;
		})
	)) as unknown as ArtistManifest[];

	const allReleases: Release[] = allManifests
		.map((manifest) => {
			return manifest.releases.map((release) => {
				return {
					...release,
					artistName: manifest.artist.name
				};
			});
		})
		.flat();

	return json(allReleases);
}
