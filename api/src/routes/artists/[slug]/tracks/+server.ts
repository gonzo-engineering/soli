import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { TABLES } from '@soli/shared/config';
import type { Track } from '@soli/shared/types';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	return handlePostgrestQuery<Track[]>(
		async () => await supabase.from(TABLES.tracks).select().eq('artist_id', params.slug),
		{ errorMessage: 'Failed to fetch tracks for artist' }
	);
};
