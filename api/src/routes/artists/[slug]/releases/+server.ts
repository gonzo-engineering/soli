import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { TABLES } from '../../../../../../shared/config';
import type { ReleaseHydrated } from '../../../../../../shared/types/hydrated';

export async function GET({ params }) {
	return handlePostgrestQuery<ReleaseHydrated[]>(
		async () => await supabase.from(TABLES.releasesRich).select().eq('artist_id', params.slug),
		{ errorMessage: 'Failed to fetch releases for artist' }
	);
}
