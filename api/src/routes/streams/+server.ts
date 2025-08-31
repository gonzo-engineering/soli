import { TABLES } from '../../../../shared/config';
import { supabase } from '$lib/server/supabase';

export async function POST({ request }) {
	const { userId, artistId, trackId, tokensUsed } = await request.json();

	if (!userId || !artistId || !trackId || !tokensUsed) {
		return new Response('Missing required fields', { status: 400 });
	}

	const { error } = await supabase
		.from(TABLES.streams)
		.insert({
			user_id: userId,
			artist_id: artistId,
			track_id: trackId,
			tokens_used: tokensUsed
		})
		.select();

	if (error) {
		return new Response('Error logging stream', { status: 500 });
	}

	return new Response('Stream logged', { status: 200 });
}
