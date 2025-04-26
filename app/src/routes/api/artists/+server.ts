import { json } from '@sveltejs/kit';

import type { Artist } from '$lib/types/index.js';
import { pinata, pinataGroups } from '$lib/server/pinata';

export async function GET() {
	const artists = await pinata.files.public.list().group(pinataGroups.artists);

	const allArtists = (await Promise.all(
		artists.files.map(async (release) => {
			const { data } = await pinata.gateways.public.get(release.cid);
			return data;
		})
	)) as unknown as Artist[];

	return json(allArtists);
}
