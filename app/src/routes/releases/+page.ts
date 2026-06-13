import { API_BASE } from '$lib/global/config';
import type { ReleaseHydrated } from '@soli/shared/types';

export const load = async ({ fetch }) => {
	const releases: ReleaseHydrated[] = await fetch(`${API_BASE}/releases`).then((res) => res.json());

	return {
		releases
	};
};
