import { TABLES } from '../../../../../../shared/config';
import { supabase } from '$lib/server/supabase';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const maybeUserID = params.slug;

	const { data: likedTrackIDs, error: likedTrackIDsError } = await supabase
		.from(TABLES.likedTracks)
		.select(`track_id`)
		.eq('user_id', maybeUserID);

	if (likedTrackIDsError) {
		return json({ error: 'Failed to fetch liked tracks' }, { status: 500 });
	}

	const { data: likedTracks, error: likedTracksError } = await supabase
		.from(TABLES.tracksRich)
		.select('*')
		.in(
			'id',
			likedTrackIDs.map((item) => item.track_id)
		);

	if (likedTracksError) {
		return json({ error: 'Failed to fetch liked tracks details' }, { status: 500 });
	}

	return json(likedTracks);
};

export const POST: RequestHandler = async ({ params, request }) => {
	const maybeUserID = params.slug;

	const { trackId } = await request.json();

	if (!trackId) {
		return json({ error: 'Missing track ID' }, { status: 400 });
	}

	const { error: likeError } = await supabase
		.from(TABLES.likedTracks)
		.insert({ user_id: maybeUserID, track_id: trackId });

	if (likeError) {
		return json({ error: 'Failed to like track' }, { status: 500 });
	}

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ params, request }) => {
	const maybeUserID = params.slug;

	const { trackId } = await request.json();

	if (!trackId) {
		return json({ error: 'Missing track ID' }, { status: 400 });
	}

	const { error: unlikeError } = await supabase
		.from(TABLES.likedTracks)
		.delete()
		.eq('user_id', maybeUserID)
		.eq('track_id', trackId);

	if (unlikeError) {
		return json({ error: 'Failed to unlike track' }, { status: 500 });
	}

	return json({ success: true });
};
