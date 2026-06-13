import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { TABLES } from '@soli/shared/config';
import type { StreamLog } from '@soli/shared/types';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	return handlePostgrestQuery<StreamLog[]>(
		async () => await supabase.from(TABLES.streams).select('*').eq('artist_id', params.slug),
		{ errorMessage: 'Failed to fetch streams for artist' }
	);
};
