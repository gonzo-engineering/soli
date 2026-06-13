import { API_BASE } from '$lib/global/config';
import { error } from '@sveltejs/kit';
import type { PostgrestResponse } from '@supabase/supabase-js';
import type { Artist, Label, ReleaseHydrated } from '@soli/shared/types';

export const load = async ({ fetch, params }) => {
	const label: PostgrestResponse<Label> = await fetch(`${API_BASE}/labels/${params.slug}`).then(
		(res) => res.json()
	);
	const artists: Artist[] = await fetch(`${API_BASE}/artists`).then((res) => res.json());
	const releases: ReleaseHydrated[] = await fetch(`${API_BASE}/releases`).then((res) => res.json());

	// Filter artists to only those who have releases
	const filteredArtists = artists.filter(
		(artist) =>
			releases.some((release) => release.artist_id === artist.id) && artist.label_id === params.slug
	);

	if (label.error) error(404, 'Label not found');

	return {
		label,
		artists: filteredArtists
	};
};
