// Returns all the releases from all the manifests

import { json } from '@sveltejs/kit';
import type { Release } from '$lib/types';
import { getManifests } from '$lib/server/pinata';

export async function GET() {
	const allManifests = await getManifests();

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
