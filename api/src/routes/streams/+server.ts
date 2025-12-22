import { TABLES } from '../../../../shared/config';
import { supabase } from '$lib/server/supabase';

export async function POST({ request }) {
	const { userId, artistId, trackId, tokensUsed } = await request.json();

	if (!userId || !artistId || !trackId || !tokensUsed) {
		return new Response('Missing required fields', { status: 400 });
	}

	const { data, error } = await supabase
		.from(TABLES.streams)
		.insert({
			user_id: userId,
			artist_id: artistId,
			track_id: trackId,
			tokens_used: tokensUsed
		})
		.select()
		.single();

	if (error) {
		return new Response('Error logging stream', { status: 500 });
	}

	const { error: ledgerError } = await supabase.from(TABLES.earningsLedger).insert({
		artist_id: artistId,
		stream_id: data.id,
		tokens_earned: tokensUsed,
		earned_at: data.streamed_at
	});

	if (ledgerError) {
		return new Response('Error logging earnings ledger entry', { status: 500 });
	}

	return new Response('Stream logged successfully', { status: 200 });
}
