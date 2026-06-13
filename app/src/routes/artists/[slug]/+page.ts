import { API_BASE } from '$lib/global/config';
import type { PostgrestResponse } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import type { ArtistHydrated } from '@soli/shared/types';

export const load = async ({ params, fetch }) => {
	const matchingArtist: PostgrestResponse<ArtistHydrated> = await fetch(
		`${API_BASE}/artists/${params.slug}`
	).then((res) => {
		return res.json();
	});

	if (matchingArtist.error) error(404, 'Artist not found');

	return {
		artist: matchingArtist
	};
};
