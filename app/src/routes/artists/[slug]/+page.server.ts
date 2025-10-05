import type { Actions } from '@sveltejs/kit';
import type { ArtistRaw } from '../../../../../shared/types';
import { API_BASE } from '$lib/global/config';
import { sortReleasesByDate } from '../../../../../shared/utils';

export const load = async ({ params, fetch }) => {
	const matchingArtist: ArtistRaw = await fetch(`${API_BASE}/artists/${params.slug}`).then(
		(res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch artist with slug: ${params.slug}`);
			}
			return res.json();
		}
	);

	if (!matchingArtist) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}

	const artistReleases = await fetch(`${API_BASE}/artists/${params.slug}/releases`).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to fetch releases for artist with slug: ${params.slug}`);
		}
		return res.json();
	});

	return {
		artist: matchingArtist,
		releases: sortReleasesByDate(artistReleases)
	};
};

export const actions: Actions = {
	toggleFollowedArtist: async ({ request, fetch, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (session) {
			const formData = await request.formData();
			const artistID = formData.get('artistID');
			const addOrRemove = formData.get('addOrRemove');
			if (artistID && addOrRemove) {
				await fetch(`${API_BASE}/users/${session.user.id}/following`, {
					method: addOrRemove === 'remove' ? 'DELETE' : 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ artistId: artistID })
				});
			}
		}
	}
};
