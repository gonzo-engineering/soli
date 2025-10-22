import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import { TABLES } from '../../../../../../shared/config';

export async function GET({ params }) {
	const userId = params.slug;
	const { data: collections, error } = await supabase
		.from(TABLES.collectionsHydrated)
		.select('*')
		.eq('user_id', userId);

	if (error) {
		console.error('Error fetching collections:', error);
		return json({ error: 'Failed to fetch collections' }, { status: 500 });
	}

	return json(collections);
}

export async function POST({ params, request }) {
	const userId = params.slug;

	const { name } = await request.json();

	if (!name) {
		return json({ error: 'Missing collection name' }, { status: 400 });
	}

	const { error } = await supabase.from(TABLES.collections).insert({ user_id: userId, name });

	if (error) {
		return json({ error: 'Failed to create collection' }, { status: 500 });
	}

	return json({ success: true });
}
