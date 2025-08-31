import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	toggleLikedTrack: async ({ request, fetch, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (session) {
			const formData = await request.formData();
			const trackId = formData.get('trackId');
			const addOrRemove = formData.get('addOrRemove');
			if (trackId && addOrRemove) {
				await fetch(`/api/users/${session.user.id}/likes`, {
					method: addOrRemove === 'remove' ? 'DELETE' : 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ trackId })
				});
				console.log(
					`Track ${addOrRemove === 'remove' ? 'removed' : 'added'} to liked tracks: ${trackId}`
				);
			}
		}
	}
};
