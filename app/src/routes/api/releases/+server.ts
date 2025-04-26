import { json } from '@sveltejs/kit';
import { pinata, pinataGroups } from '$lib/server/pinata';
import type { ArtistRaw, ReleaseRaw } from '$lib/types';

export async function GET() {
	const releases = await pinata.files.public.list().group(pinataGroups.releases);

	const allReleases = (await Promise.all(
		releases.files.map(async (release) => {
			const { data } = await pinata.gateways.public.get(release.cid);
			return data;
		})
	)) as unknown as ReleaseRaw[];

	const allReleasesWithSongURLs = await Promise.all(
		allReleases.map(async (release) => {
			const artist = await pinata.gateways.public.get(release.artistCID);
			const artistObject = artist.data as unknown as ArtistRaw;
			const imageURL = await pinata.gateways.public.convert(release.coverCID);
			const songsWithURLs = await Promise.all(
				release?.tracks?.map(async (song) => {
					const songURL = await pinata.gateways.public.convert(song.CID);
					return {
						...song,
						url: songURL
					};
				})
			);
			return {
				id: release.id,
				name: release.name,
				type: release.type,
				artist: artistObject,
				releaseDate: release.releaseDate,
				coverLink: imageURL,
				tracks: songsWithURLs
			};
		})
	);

	return json(allReleasesWithSongURLs);
}
