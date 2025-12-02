import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { TABLES } from '../../../../../../shared/config';
import type { Track } from '../../../../../../shared/types/core';

export async function GET({ params }) {
	return handlePostgrestQuery<Track[]>(
		async () => await supabase.from(TABLES.tracks).select().eq('artist_id', params.slug),
		{ errorMessage: 'Failed to fetch tracks for artist' }
	);
}
