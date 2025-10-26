import { API_BASE } from '$lib/global/config';
import type { MixtapeHydrated } from '../../../../../../shared/types/hydrated';

export const load = async ({ fetch, params }) => {
	const mixtape: MixtapeHydrated = await fetch(`${API_BASE}/mixtapes/${params.slug}`).then((res) =>
		res.json()
	);
	if (!mixtape)
		return {
			status: 404,
			error: new Error('Not Found')
		};
	return {
		mixtape
	};
};
