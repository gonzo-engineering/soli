import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import { TABLES } from '@soli/shared/config';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	return handlePostgrestQuery(
		async () => supabase.from(TABLES.collectionsRich).select('*').eq('id', params.slug).single(),
		{ errorMessage: 'Failed to fetch collection' }
	);
};

export const PATCH: RequestHandler = async ({ request, params }) => {
	const collectionId = params.slug;
	const { releaseId, addOrRemove } = await request.json();

	if (!releaseId) {
		return json({ error: 'Missing release ID' }, { status: 400 });
	}

	if (addOrRemove === 'remove') {
		const { error } = await supabase
			.from(TABLES.collectionReleases)
			.delete()
			.eq('collection_id', collectionId)
			.eq('release_id', releaseId);

		if (error) {
			console.error('Error removing release from collection:', error);
			return json({ error: 'Failed to remove release from collection' }, { status: 500 });
		}

		return json({ success: true });
	}

	const { error } = await supabase
		.from(TABLES.collectionReleases)
		.insert({ collection_id: collectionId, release_id: releaseId });

	if (error) {
		console.error('Error adding release to collection:', error);
		return json({ error: 'Failed to add release to collection' }, { status: 500 });
	}

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request, params }) => {
	const collectionId = params.slug;
	const { userId } = await request.json();

	const { error } = await supabase
		.from(TABLES.collections)
		.delete()
		.eq('id', collectionId)
		.eq('user_id', userId);

	if (error) {
		console.error('Error deleting collection:', error);
		return json({ error: 'Failed to delete collection' }, { status: 500 });
	}

	return json({ success: true });
};
