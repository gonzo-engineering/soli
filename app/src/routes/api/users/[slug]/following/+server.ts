import { TABLES } from '$lib/global/config';
import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const userId = params.slug;

	const { data, error } = await supabase
		.from(TABLES.followedArtists)
		.select('artist_id')
		.eq('user_id', userId);

	if (error) {
		console.error('Error fetching user following data:', error);
		return json({ error: 'Failed to fetch user following data' }, { status: 500 });
	}

	return json(data.map((item) => item.artist_id));
}
