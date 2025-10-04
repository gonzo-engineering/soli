import { TABLES } from '../../../../../shared/config';
import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import type { ReleaseHydrated } from '../../../../../shared/types';

export async function GET({ params }) {
	return handlePostgrestQuery<ReleaseHydrated>(
		async () => await supabase.from(TABLES.releasesHydrated).select().eq('id', params.slug).single()
	);
}
