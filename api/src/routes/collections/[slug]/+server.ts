import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import { TABLES } from '../../../../../shared/config';

export async function GET({ params }) {
	const collectionId = params.slug;
	const { data: collection, error } = await supabase
		.from(TABLES.collectionsRich)
		.select('*')
		.eq('id', collectionId)
		.single();

	if (error) {
		console.error('Error fetching collection:', error);
		return json({ error: 'Failed to fetch collection' }, { status: 500 });
	}

	return json(collection);
}

export async function PATCH({ request, params }) {
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
}

export async function DELETE({ request, params }) {
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
}
