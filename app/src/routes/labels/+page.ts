import { API_BASE } from '$lib/global/config';
import type { LabelHydrated } from '@soli/shared/types/hydrated';

export const load = async ({ fetch }) => {
	const labels: LabelHydrated[] = await fetch(`${API_BASE}/labels`).then((res) => res.json());

	return {
		labels
	};
};
