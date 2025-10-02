import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';
import { TABLES } from '../../../../shared/config';
import type { ReleaseHydrated, ReleaseRaw } from '../../../../shared/types';
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

export async function POST({ request }) {
	const body: Partial<ReleaseRaw> = await request.json();

	const { data, error } = await supabase.from(TABLES.releases).insert(body).select().single();

	if (error || !data) {
		console.error('Error creating new release:', error);
		return json({ error: 'Failed to create new release' }, { status: 500 });
	}

	return json(data);
}
