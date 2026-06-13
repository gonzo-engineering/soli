import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import { TABLES } from '@soli/shared/config';
import type { ReleaseHydrated } from '@soli/shared/types';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	if (!params.slug || !uuidRegex.test(params.slug)) {
		return json({ error: 'Invalid release ID' }, { status: 400 });
	}
	return handlePostgrestQuery<ReleaseHydrated>(
		async () => await supabase.from(TABLES.releasesRich).select().eq('id', params.slug).single(),
		{ errorMessage: 'Failed to fetch release' }
	);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const { error } = await supabase.from(TABLES.releases).delete().eq('id', params.slug);

	if (error) {
		console.error('Error deleting release:', error);
		return json({ error: 'Failed to delete release' }, { status: 500 });
	}

	return json({ success: true });
};
