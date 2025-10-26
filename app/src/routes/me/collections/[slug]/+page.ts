import { API_BASE } from '$lib/global/config';
import type { CollectionHydrated } from '../../../../../../shared/types/hydrated';

export const load = async ({ fetch, params }) => {
	const collection: CollectionHydrated = await fetch(`${API_BASE}/collections/${params.slug}`).then(
		(res) => res.json()
	);
	if (!collection)
		return {
			status: 404,
			error: new Error('Not Found')
		};
	return {
		collection
	};
};
