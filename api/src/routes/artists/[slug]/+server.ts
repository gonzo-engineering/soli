import { TABLES } from '../../../../../shared/config';
import { supabase } from '$lib/server/supabase';
import type { ArtistRaw } from '../../../../../shared/types';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const artistId = params.slug;

	const {
		data,
		error
	}: {
		data: ArtistRaw[] | null;
		error: Error | null;
	} = await supabase.from(TABLES.artists).select().eq('id', artistId).single();

	if (error || !data) {
		console.error('Error fetching artist data:', error);
		return json({ error: 'Failed to fetch artist data' }, { status: 500 });
	}

	return json(data);
}

export async function PATCH({ request, params }) {
	const artistId = params.slug;
	const body: Partial<ArtistRaw> = await request.json();

	const { data, error } = await supabase.from(TABLES.artists).update(body).eq('id', artistId);

	if (error) {
		console.error('Error updating artist data:', error);
		return json({ error: 'Failed to update artist data' }, { status: 500 });
	}

	return json(data);
}
