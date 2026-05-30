import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { TABLES } from '../../../../../../shared/config';
import type { ReleaseHydrated } from '../../../../../../shared/types/hydrated';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	return handlePostgrestQuery<ReleaseHydrated[]>(
		async () => await supabase.from(TABLES.releasesRich).select().eq('artist_id', params.slug),
		{ errorMessage: 'Failed to fetch releases for artist' }
	);
};
