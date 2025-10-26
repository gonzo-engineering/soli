import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import { TABLES } from '../../../../shared/config';

export async function POST({ request }) {
	const { userId, name, description } = await request.json();

	if (!name) {
		return json({ error: 'Missing collection name' }, { status: 400 });
	}

	const { error } = await supabase
		.from(TABLES.collections)
		.insert({ user_id: userId, name, description });

	if (error) {
		return json({ error: 'Failed to create collection' }, { status: 500 });
	}

	return json({ success: true });
}
