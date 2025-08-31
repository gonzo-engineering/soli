import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';
import { TABLES } from '../../../../shared/config';
import type { ReleaseHydrated } from '../../../../shared/types';
import { sortReleasesByDate } from '../../../../shared/utils';

export async function GET() {
	const {
		data,
		error
	}: {
		data: ReleaseHydrated[] | null;
		error: Error | null;
	} = await supabase.from(TABLES.releasesHydrated).select();

	if (error || !data) {
		console.error('Error fetching artist data:', error);
		return json({ error: 'Failed to fetch artist data' }, { status: 500 });
	}

	return json(sortReleasesByDate(data));
}
