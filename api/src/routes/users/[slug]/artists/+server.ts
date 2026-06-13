import { TABLES } from '@soli/shared/config';
import type { ArtistHydrated } from '@soli/shared/types';

import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const userId = params.slug;

	const { data: relatedArtistsData, error } = await supabase
		.from(TABLES.artistMembers)
		.select('artist_id')
		.eq('user_id', userId);

	if (error) {
		console.error('Error fetching user artists:', error);
		return json({ error: 'Failed to fetch user artists' }, { status: 500 });
	}

	const {
		data: connectedArtists,
		error: artistsError
	}: {
		data: ArtistHydrated[] | null;
		error: Error | null;
	} = await supabase
		.from(TABLES.artistsRich)
		.select('*')
		.in(
			'id',
			relatedArtistsData.map((u) => u.artist_id)
		);
	if (artistsError) {
		console.error('Error fetching connected artists:', artistsError);
		return json({ error: 'Failed to fetch connected artists' }, { status: 500 });
	}
	return json(connectedArtists);
};
