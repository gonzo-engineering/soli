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
