import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { TABLES } from '../../../../../../shared/config';

export async function GET({ params }) {
	return handlePostgrestQuery(
		async () => supabase.from(TABLES.mixtapesRich).select('*').eq('user_id', params.slug),
		{ errorMessage: 'Failed to fetch mixtapes' }
	);
}
