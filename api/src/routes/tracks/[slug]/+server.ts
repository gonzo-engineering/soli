import { supabase } from '$lib/server/supabase';
import { json, type RequestHandler } from '@sveltejs/kit';
import { TABLES } from '../../../../../shared/config';

export const DELETE: RequestHandler = async ({ params }) => {
	const { error } = await supabase.from(TABLES.tracks).delete().eq('id', params.slug);

	if (error) {
		console.error('Error deleting track:', error);
		return json({ error: 'Failed to delete track' }, { status: 500 });
	}

	return json({ success: true });
};
