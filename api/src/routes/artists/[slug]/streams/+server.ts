import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { TABLES } from '../../../../../../shared/config';
import type { StreamLog } from '../../../../../../shared/types/core';

export async function GET({ params }) {
	return handlePostgrestQuery<StreamLog[]>(
		async () => await supabase.from(TABLES.streams).select('*').eq('artist_id', params.slug),
		{ errorMessage: 'Failed to fetch streams for artist' }
	);
}
