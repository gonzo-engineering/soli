import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { TABLES } from '../../../../../../shared/config/index';
import type { CollectionHydrated } from '../../../../../../shared/types/hydrated';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	return handlePostgrestQuery<CollectionHydrated[]>(
		async () => supabase.from(TABLES.collectionsRich).select('*').eq('user_id', params.slug),
		{ errorMessage: 'Failed to fetch collections' }
	);
};
