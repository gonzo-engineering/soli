import { API_BASE } from '$lib/global/config';
import type { PostgrestResponse } from '@supabase/supabase-js';
import type { CollectionHydrated } from '@soli/shared/types/hydrated';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch, params }) => {
	const collection: PostgrestResponse<CollectionHydrated> = await fetch(
		`${API_BASE}/collections/${params.slug}`
	).then((res) => res.json());

	if (collection.error) error(404, 'Collection not found');

	return {
		collection
	};
};
