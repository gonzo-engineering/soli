import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { TABLES } from '../../../../../../shared/config';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	return handlePostgrestQuery(
		async () => supabase.from(TABLES.mixtapesRich).select('*').eq('user_id', params.slug),
		{ errorMessage: 'Failed to fetch mixtapes' }
	);
};
