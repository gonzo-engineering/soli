import { TABLES } from '../../../../shared/config';
import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import type { ArtistRaw } from '../../../../shared/types';

export async function GET() {
	return handlePostgrestQuery<ArtistRaw[]>(
		async () => await supabase.from(TABLES.artists).select()
	);
}
