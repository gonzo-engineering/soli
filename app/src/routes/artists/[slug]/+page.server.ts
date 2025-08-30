import { TABLES } from '$lib/global/config';
import type { Actions } from '@sveltejs/kit';
import type { ArtistRaw, ReleaseHydrated } from '../../../../../shared/types';

// TODO: Explore static generation where possible to
// improve performance and keep requests to a minimum.
// May entail splitting the API into its own thing.

export const load = async ({ params, fetch }) => {
	const matchingArtist: ArtistRaw = await fetch(`/api/artists/${params.slug}`).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to fetch artist with slug: ${params.slug}`);
		}
		return res.json();
	});

	if (!matchingArtist) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}

	const allReleases: ReleaseHydrated[] = await fetch(`/api/releases`).then((res) => res.json());

	const artistReleases = allReleases.filter((release) => release.artist_id === matchingArtist.id);

	return {
		artist: matchingArtist,
		releases: artistReleases
	};
};

export const actions: Actions = {
	toggleFollowedArtist: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (session) {
			const formData = await request.formData();
			const artistID = formData.get('artistID');
			if (artistID) {
				const { data: existingFollowedArtist } = await supabase
					.from(TABLES.followedArtists)
					.select('*')
					.eq('user_id', session.user.id)
					.eq('artist_id', artistID)
					.single();

				if (existingFollowedArtist) {
					await supabase.from(TABLES.followedArtists).delete().eq('artist_id', artistID);
					console.log(`Artist removed from followed artists: ${artistID}`);
				} else {
					await supabase.from(TABLES.followedArtists).insert({
						user_id: session.user.id,
						artist_id: artistID
					});
					console.log(`Artist added to followed artists: ${artistID}`);
				}
			}
		}
	}
};
