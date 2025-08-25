import type { LayoutServerLoad } from './$types';
import type { ReleaseHydrated, TrackRaw, UserProfile } from '../../../shared/types';
import { TABLES } from '$lib/global/config';

export const load: LayoutServerLoad = async ({
	locals: { supabase, safeGetSession },
	cookies,
	fetch
}) => {
	const { session, user } = await safeGetSession();

	let profileData = null;
	let likedTracks: {
		track: TrackRaw;
		release: ReleaseHydrated | null;
	}[] = [];

	if (session) {
		const {
			data: profile
		}: {
			data: UserProfile | null;
		} = await supabase
			.from(TABLES.users)
			.select(`first_name, tokens_balance, pay_per_stream`)
			.eq('id', session.user.id)
			.single();
		profileData = profile;
		const {
			data: likedTrackIDs
		}: {
			data: { track_id: string }[] | null;
		} = await supabase.from(TABLES.likedTracks).select(`track_id`).eq('user_id', session.user.id);
		const trackIDs = likedTrackIDs ? likedTrackIDs.map((t) => t.track_id) : [];
		const { data: likedTracksRaw } = await supabase
			.from('tracks')
			.select(`id, artist_id, title, ipfs_cid, duration_seconds`)
			.in('id', trackIDs);
		likedTracks = likedTracksRaw?.map((track) => ({ track, release: null })) || [];
		for (const likedTrack of likedTracks) {
			const { data: releaseID, error: releaseIDError } = await supabase
				.from('release_tracks')
				.select('release_id')
				.eq('track_id', likedTrack.track.id)
				.limit(1)
				.single();
			if (releaseIDError) {
				console.error('Error fetching release ID:', releaseIDError);
				continue;
			}
			const release = await fetch(`/api/releases/${releaseID.release_id}`).then((res) =>
				res.json()
			);
			likedTrack.release = release;
		}
		likedTracks = likedTracks.filter((t) => t.release);
	}

	return {
		session,
		user,
		profileData,
		likedTracks,
		cookies: cookies.getAll()
	};
};
