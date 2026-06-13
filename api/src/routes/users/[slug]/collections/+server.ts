import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { TABLES } from '@soli/shared/config/index';
import type { CollectionHydrated } from '@soli/shared/types';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	return handlePostgrestQuery<CollectionHydrated[]>(
		async () => supabase.from(TABLES.collectionsRich).select('*').eq('user_id', params.slug),
		{ errorMessage: 'Failed to fetch collections' }
	);
};
