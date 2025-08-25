import { TABLES } from '$lib/global/config';
import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import type { ReleaseHydrated } from '../../../../../../shared/types';

export async function GET({ params }) {
	const {
		data,
		error
	}: {
		data: ReleaseHydrated | null;
		error: Error | null;
	} = await supabase.from(TABLES.releasesHydrated).select().eq('id', params.slug).single();

	if (error || !data) {
		console.error('Error fetching release data:', error);
		return json({ error: 'Failed to fetch release data' }, { status: 500 });
	}

	return json(data);
}
