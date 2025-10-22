import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import { TABLES } from '../../../../../../shared/config';

export async function GET({ params }) {
	const userId = params.slug;
	const { data: mixtapes, error } = await supabase
		.from(TABLES.mixtapesHydrated)
		.select('*')
		.eq('user_id', userId);

	if (error) {
		console.error('Error fetching mixtapes:', error);
		return json({ error: 'Failed to fetch mixtapes' }, { status: 500 });
	}

	return json(mixtapes);
}
