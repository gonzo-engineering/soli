import { TABLES } from '@soli/shared/config';
import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import type { Artist } from '@soli/shared/types/core';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return handlePostgrestQuery<Artist[]>(async () => await supabase.from(TABLES.artists).select(), {
		transform: (data) => data.sort((a, b) => a.name.localeCompare(b.name))
	});
};
