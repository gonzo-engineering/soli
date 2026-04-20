import { TABLES } from '../../../../shared/config';
import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import type { Artist } from '../../../../shared/types/core';

export async function GET() {
	return handlePostgrestQuery<Artist[]>(async () => await supabase.from(TABLES.labels).select(), {
		transform: (data) => data.sort((a, b) => a.name.localeCompare(b.name))
	});
}
