import type { Actions } from '@sveltejs/kit';
import type { ReleaseHydrated } from '../../../../../shared/types';
import { TABLES } from '../../../lib/global/config';

export const load = async ({ fetch, params }) => {
	const releases: ReleaseHydrated[] = await fetch('/api/releases').then((res) => res.json());

	const matchingRelease = releases.find((release) => release.id === params.slug);

	if (!matchingRelease) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}

	return {
		release: matchingRelease
	};
};

export const actions: Actions = {
	toggleTrackInFavourites: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (session) {
			const formData = await request.formData();
			const trackId = formData.get('trackId');
			if (trackId) {
				const { data: existingFavourite } = await supabase
					.from(TABLES.likedTracks)
					.select('*')
					.eq('user_id', session.user.id)
					.eq('track_id', trackId)
					.single();

				if (existingFavourite) {
					await supabase.from(TABLES.likedTracks).delete().eq('track_id', trackId);
					console.log(`Track removed from favourites: ${trackId}`);
				} else {
					await supabase.from(TABLES.likedTracks).insert({
						user_id: session.user.id,
						track_id: trackId
					});
					console.log(`Track added to favourites: ${trackId}`);
				}
			}
		}
	}
};
