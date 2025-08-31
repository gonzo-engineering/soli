import { TABLES } from '../../../../../../shared/config';
import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import type { LikedTrackObject } from '../../../../../../shared/types';

export async function GET({ params }) {
	const maybeUserID = params.slug;

	const { data: likedTrackIDs, error: likedTrackIDsError } = await supabase
		.from(TABLES.likedTracks)
		.select(`track_id`)
		.eq('user_id', maybeUserID);

	if (likedTrackIDsError) {
		return json({ error: 'Failed to fetch liked tracks' }, { status: 500 });
	}

	const { data: likedTracksRaw, error: likedTracksError } = await supabase
		.from(TABLES.tracks)
		.select(`id, artist_id, title, ipfs_cid, duration_seconds, created_at`)
		.in(
			'id',
			likedTrackIDs.map((item) => item.track_id)
		);

	if (likedTracksError) {
		return json({ error: 'Failed to fetch liked tracks details' }, { status: 500 });
	}

	const likedTracks: LikedTrackObject[] = [];

	for (const likedTrack of likedTracksRaw) {
		const { data: releaseID, error: releaseIDError } = await supabase
			.from(TABLES.releaseTracks)
			.select('release_id')
			.eq('track_id', likedTrack.id)
			.limit(1)
			.single();
		if (releaseIDError) {
			console.error('Error fetching release ID:', releaseIDError);
			continue;
		}
		const { data: release } = await supabase
			.from(TABLES.releasesHydrated)
			.select('*')
			.eq('id', releaseID.release_id)
			.single();
		likedTracks.push({ track: likedTrack, release });
	}

	return json(likedTracks);
}

export async function POST({ params, request }) {
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
}

export async function DELETE({ params, request }) {
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
}
