import type { LayoutServerLoad } from './$types';
import type { ReleaseHydrated, TrackRaw, UserProfile } from '../../../shared/types';
import { TABLES } from '$lib/global/config';

export const load: LayoutServerLoad = async ({
	locals: { supabase, safeGetSession },
	cookies,
	fetch
}) => {
	const { session, user } = await safeGetSession();

	let profileData: UserProfile | null = null;
	let likedTracks: {
		track: TrackRaw;
		release: ReleaseHydrated | null;
	}[] = [];
	let followedIDs: string[] = [];

	if (session) {
		profileData = await fetch(`/api/users/${session.user.id}`).then((res) => res.json());
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
		followedIDs = await fetch(`/api/users/${session.user.id}/following`).then((res) => res.json());
	}

	return {
		session,
		user,
		profileData,
		likedTracks,
		followedArtists: followedIDs,
		cookies: cookies.getAll()
	};
};
