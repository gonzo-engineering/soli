import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { TABLES } from '../../../../shared/config';
import { sortReleasesByDate } from '../../../../shared/utils';
import type { ReleaseHydrated, ReleaseRaw } from '../../../../shared/types';

export async function GET() {
	return handlePostgrestQuery<ReleaseHydrated[]>(
		async () => await supabase.from(TABLES.releasesHydrated).select(),
		{
			errorMessage: 'Failed to fetch artist data',
			transform: sortReleasesByDate
		}
	);
}

export async function POST({ request }) {
	const body: Partial<ReleaseRaw> = await request.json();
	return handlePostgrestQuery<ReleaseRaw>(
		async () => await supabase.from(TABLES.releases).insert(body).select().single(),
		{ errorMessage: 'Failed to create new release' }
	);
}
