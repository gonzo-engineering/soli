import { API_BASE } from '$lib/global/config';
import type { ReleaseHydrated } from '../../../../../shared/types';

export const load = async ({ fetch, params }) => {
	const release: ReleaseHydrated = await fetch(`${API_BASE}/releases/${params.slug}`).then((res) =>
		res.json()
	);

	if (!release) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}

	return {
		release
	};
};
