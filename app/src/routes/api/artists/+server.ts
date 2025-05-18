import { TABLES } from '$lib/global/config';
import { supabase } from '$lib/server/supabase';
import type { ArtistRaw } from '$lib/types';
import { json } from '@sveltejs/kit';

export async function GET() {
	const {
		data,
		error
	}: {
		data: ArtistRaw[] | null;
		error: Error | null;
	} = await supabase.from(TABLES.artists).select();

	if (error || !data) {
		console.error('Error fetching artist data:', error);
		return json({ error: 'Failed to fetch artist data' }, { status: 500 });
	}

	// Sort artists by name
	data.sort((a, b) => {
		if (a.name < b.name) return -1;
		if (a.name > b.name) return 1;
		return 0;
	});

	return json(data);
}
