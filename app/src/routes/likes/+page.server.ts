import { TABLES } from '$lib/global/config';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	toggleLikedTrack: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (session) {
			const formData = await request.formData();
			const trackId = formData.get('trackId');
			if (trackId) {
				const { data: existingLikedTrack } = await supabase
					.from(TABLES.likedTracks)
					.select('*')
					.eq('user_id', session.user.id)
					.eq('track_id', trackId)
					.single();

				if (existingLikedTrack) {
					await supabase.from(TABLES.likedTracks).delete().eq('track_id', trackId);
					console.log(`Track removed from liked tracks: ${trackId}`);
				} else {
					await supabase.from(TABLES.likedTracks).insert({
						user_id: session.user.id,
						track_id: trackId
					});
					console.log(`Track added to liked tracks: ${trackId}`);
				}
			}
		}
	}
};
