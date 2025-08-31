import { TABLES } from '$lib/global/config';
import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const artistId = params.slug;

	const { data, error } = await supabase
		.from(TABLES.releasesHydrated)
		.select()
		.eq('artist_id', artistId);

	if (error || !data) {
		console.error('Error fetching artist releases:', error);
		return json({ error: 'Failed to fetch artist releases' }, { status: 500 });
	}

	return json(data);
}
