import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import { TABLES } from '@soli/shared/config';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { userId, name, description } = await request.json();

	if (!name) {
		console.log('Mixtape name is missing');
		return json({ error: 'Missing mixtape name' }, { status: 400 });
	}

	const { error } = await supabase
		.from(TABLES.mixtapes)
		.insert({ user_id: userId, name, description });

	if (error) {
		console.log('Error creating mixtape:', error);
		return json({ error: 'Failed to create mixtape' }, { status: 500 });
	}

	return json({ success: true });
};
