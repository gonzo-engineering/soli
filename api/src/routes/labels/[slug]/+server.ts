import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { TABLES } from '../../../../../shared/config';
import type { Label } from '../../../../../shared/types/core';

export async function GET({ params }) {
	return handlePostgrestQuery<Label>(
		async () => await supabase.from(TABLES.labels).select().eq('id', params.slug).single(),
		{ errorMessage: 'Failed to fetch label' }
	);
}
