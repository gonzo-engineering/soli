import { supabase } from '$lib/server/supabase';
import { json, type RequestHandler } from '@sveltejs/kit';
import { TABLES } from '@soli/shared/config';

export const DELETE: RequestHandler = async ({ params }) => {
	const { error } = await supabase
		.from(TABLES.releaseTracks)
		.delete()
		.eq('release_id', params.slug)
		.eq('track_id', params.trackId);

	if (error) {
		console.error('Error removing track from release:', error);
		return json({ error: 'Failed to remove track from release' }, { status: 500 });
	}

	return json({ success: true });
};