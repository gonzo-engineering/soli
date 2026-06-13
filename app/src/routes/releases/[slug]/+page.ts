import { API_BASE } from '$lib/global/config';
import { error } from '@sveltejs/kit';
import type { ReleaseHydrated } from '@soli/shared/types/hydrated';
import type { PostgrestResponse } from '@supabase/supabase-js';

export const load = async ({ fetch, params }) => {
	const release: PostgrestResponse<ReleaseHydrated> = await fetch(
		`${API_BASE}/releases/${params.slug}`
	).then((res) => res.json());

	if (release.error) error(404, 'Release not found');

	return {
		release
	};
};
