import { json } from '@sveltejs/kit';

import type { ArtistHydrated, ArtistRaw } from '$lib/types/index.js';
import { pinata, pinataGroups } from '$lib/server/pinata';

export async function GET() {
	const artists = await pinata.files.public.list().group(pinataGroups.artists);

	const allArtists = (await Promise.all(
		artists.files.map(async (release) => {
			const { data } = await pinata.gateways.public.get(release.cid);
			return data;
		})
	)) as unknown as ArtistRaw[];

	const allArtistsWithLinks: ArtistHydrated[] = await Promise.all(
		allArtists.map(async (artist) => {
			if (!artist.imageCID)
				return {
					id: artist.id,
					name: artist.name,
					description: artist.description,
					website: artist.website
				};
			const imageLink = await pinata.gateways.public.convert(artist.imageCID);
			return {
				id: artist.id,
				name: artist.name,
				description: artist.description,
				website: artist.website,
				imageLink
			};
		})
	);

	return json(allArtistsWithLinks);
}
