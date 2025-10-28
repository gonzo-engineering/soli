import { TABLES } from '../../../../../shared/config';
import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import type { Artist } from '../../../../../shared/types/core';
import type { ArtistHydrated } from '../../../../../shared/types/hydrated';

export async function GET({ params }) {
	return handlePostgrestQuery<ArtistHydrated>(
		async () => await supabase.from(TABLES.artistsRich).select().eq('id', params.slug).single(),
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
