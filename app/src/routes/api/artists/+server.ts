// Returns all the artist manifests

import { json } from '@sveltejs/kit';
import { pinata, pinataGroups } from '$lib/server/pinata';
import type { ArtistManifest } from '$lib/types';

export async function GET() {
	const manifests = await pinata.files.public.list().group(pinataGroups.manifests);

	const allManifests = (await Promise.all(
		manifests.files.map(async (manifest) => {
			const { data } = await pinata.gateways.public.get(manifest.cid);
			return data;
		})
	)) as unknown as ArtistManifest[];

	return json(allManifests);
}
