import { TABLES } from '../../../../../shared/config';
import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import type { Artist } from '../../../../../shared/types/core';

export async function GET({ params }) {
	return handlePostgrestQuery<Artist>(
		async () => await supabase.from(TABLES.artists).select().eq('id', params.slug).single(),
		{ errorMessage: 'Failed to fetch artist' }
	);
}

export async function PATCH({ request, params }) {
	const body: Partial<Artist> = await request.json();
	return handlePostgrestQuery<Artist>(
		async () => await supabase.from(TABLES.artists).update(body).eq('id', params.slug),
		{ errorMessage: 'Failed to update artist details' }
	);
}
