import { API_BASE } from '$lib/global/config';
import type { PostgrestResponse } from '@supabase/supabase-js';
import type { MixtapeHydrated } from '../../../../../../shared/types/hydrated';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch, params }) => {
	const mixtape: PostgrestResponse<MixtapeHydrated> = await fetch(
		`${API_BASE}/mixtapes/${params.slug}`
	).then((res) => res.json());

	if (mixtape.error) error(404, 'Mixtape not found');

	return {
		mixtape
	};
};
