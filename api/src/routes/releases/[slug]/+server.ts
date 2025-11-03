import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import { TABLES } from '../../../../../shared/config';
import type { ReleaseHydrated } from '../../../../../shared/types/hydrated';

export async function GET({ params }) {
	return handlePostgrestQuery<ReleaseHydrated>(
		async () => await supabase.from(TABLES.releasesRich).select().eq('id', params.slug).single(),
		{ errorMessage: 'Failed to fetch release' }
	);
}

export async function DELETE({ params }) {
	const { error } = await supabase.from(TABLES.releases).delete().eq('id', params.slug);

	if (error) {
		console.error('Error deleting release:', error);
		return json({ error: 'Failed to delete release' }, { status: 500 });
	}

	return json({ success: true });
}
