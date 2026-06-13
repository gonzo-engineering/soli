import type { LayoutServerLoad } from './$types';
import { API_BASE } from '$lib/global/config';
import type { Artist } from '@soli/shared/types/core';
import type { ReleaseHydrated } from '@soli/shared/types/hydrated';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies, fetch }) => {
	const { session, user } = await safeGetSession();

	let followedArtistIDs: string[] = [];

	const userId = session?.user.id;

	if (session && userId) {
		followedArtistIDs = await fetch(`${API_BASE}/users/${userId}/following`).then((res) =>
			res.json()
		);
	}

	const artists: Artist[] = await fetch(`${API_BASE}/artists`).then((res) => res.json());
	const releases: ReleaseHydrated[] = await fetch(`${API_BASE}/releases`).then((res) => res.json());
	const labels = await fetch(`${API_BASE}/labels`).then((res) => res.json());

	// Artists
	// Filter artists to only those who have releases
	const filteredArtists = artists.filter((artist) =>
		releases.some((release) => release.artist_id === artist.id)
	);
	const followedArtists = filteredArtists.filter((artist) => followedArtistIDs.includes(artist.id));
	const otherArtists = filteredArtists.filter((artist) => !followedArtistIDs.includes(artist.id));
	const featuredArtist = otherArtists[Math.floor(Math.random() * otherArtists.length)];

	const artistsOrganised = {
		featured: featuredArtist,
		followed: followedArtists,
		other: otherArtists.filter((artist) => artist.id !== featuredArtist.id)
	};

	// Releases
	const latestAlbums = releases.filter((release) => release.release_type === 'album').slice(0, 6);
	const latestEPS = releases.filter((release) => release.release_type === 'ep').slice(0, 6);
	const latestSingles = releases.filter((release) => release.release_type === 'single').slice(0, 6);

	const latestReleases = [
		{
			label: 'Albums',
			releases: latestAlbums
		},
		{
			label: 'EPs',
			releases: latestEPS
		},
		{
			label: 'Singles',
			releases: latestSingles
		}
	];

	// Genres
	const genres = Array.from(new Set(releases.flatMap((release) => release.genres || [])));

	return {
		session,
		user,
		cookies: cookies.getAll(),
		artists: artistsOrganised,
		latestReleases,
		labels,
		genres
	};
};
