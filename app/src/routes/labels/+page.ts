import { API_BASE } from '$lib/global/config';
import type { Label } from '../../../../shared/types/core';

export const load = async ({ fetch }) => {
	const labels: Label[] = await fetch(`${API_BASE}/labels`).then((res) => res.json());

	return {
		labels
	};
};
