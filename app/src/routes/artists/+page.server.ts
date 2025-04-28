import { pinata } from '$lib/server/pinata';
import type { ArtistManifest } from '$lib/types/index.js';

export const load = async ({ fetch }) => {
	const artists: ArtistManifest[] = await fetch('/api/artists').then((res) => res.json());

	const artistsWithLinks = await Promise.all(
		artists.map(async (artist) => {
			if (!artist.artist.image_cid) return artist;
			const imageLink = await pinata.gateways.public.convert(artist.artist.image_cid);
			return {
				...artist,
				artist: {
					...artist.artist,
					imageLink
				}
			};
		})
	);

	return {
		artistsWithLinks
	};
};
