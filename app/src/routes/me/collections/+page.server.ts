import { API_BASE } from '$lib/global/config';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	createCollection: async ({ request, fetch, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (session) {
			const formData = await request.formData();
			const collectionName = formData.get('collectionName');
			if (collectionName) {
				console.log('Creating collection with name:', collectionName);
				await fetch(`${API_BASE}/users/${session.user.id}/collections`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ name: collectionName })
				});
				console.log(`Created new collection: ${collectionName}`);
			}
		}
	},
	addOrRemoveRelease: async ({ request, fetch, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (session) {
			const formData = await request.formData();
			const collectionId = formData.get('collectionId');
			const releaseId = formData.get('releaseId');
			const add = formData.get('add') === 'true';
			if (collectionId && releaseId) {
				await fetch(`${API_BASE}/collections/${collectionId}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ releaseId, collectionId, add })
				});
			}
		}
	}
};
