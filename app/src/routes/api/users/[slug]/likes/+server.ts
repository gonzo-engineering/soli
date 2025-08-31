import { TABLES } from '$lib/global/config';
import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import type { ReleaseHydrated, TrackRaw } from '../../../../../../../shared/types';

export async function GET({ params, fetch }) {
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

	const likedTracks: {
		track: TrackRaw;
		release: ReleaseHydrated;
	}[] = [];

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
		const release = await fetch(`/api/releases/${releaseID.release_id}`).then((res) => res.json());
		likedTracks.push({ track: likedTrack, release });
	}

	return json(likedTracks);
}
