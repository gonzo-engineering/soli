import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import { TABLES } from '@soli/shared/config';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	return handlePostgrestQuery(
		async () => supabase.from(TABLES.mixtapesRich).select('*').eq('id', params.slug).single(),
		{ errorMessage: 'Failed to fetch mixtape' }
	);
};

export const PATCH: RequestHandler = async ({ request, params }) => {
	const mixtapeId = params.slug;
	const { trackId } = await request.json();

	if (!trackId) {
		return json({ error: 'Missing track ID' }, { status: 400 });
	}

	const { error } = await supabase
		.from(TABLES.mixtapeTracks)
		.insert({ mixtape_id: mixtapeId, track_id: trackId });

	if (error) {
		return json({ error: 'Failed to add track to mixtape' }, { status: 500 });
	}

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request, params }) => {
	const mixtapeId = params.slug;
	const { userId } = await request.json();

	const { error } = await supabase
		.from(TABLES.mixtapes)
		.delete()
		.eq('id', mixtapeId)
		.eq('user_id', userId);

	if (error) {
		console.error('Error deleting mixtape:', error);
		return json({ error: 'Failed to delete mixtape' }, { status: 500 });
	}

	return json({ success: true });
};
