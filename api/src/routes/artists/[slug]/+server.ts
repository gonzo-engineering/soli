import { TABLES } from '../../../../../shared/config';
import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import type { ArtistRaw } from '../../../../../shared/types';

export async function GET({ params }) {
	return handlePostgrestQuery<ArtistRaw>(
		async () => await supabase.from(TABLES.artists).select().eq('id', params.slug).single()
	);
}

export async function PATCH({ request, params }) {
	const body: Partial<ArtistRaw> = await request.json();
	return handlePostgrestQuery<ArtistRaw>(
		async () => await supabase.from(TABLES.artists).update(body).eq('id', params.slug)
	);
}
