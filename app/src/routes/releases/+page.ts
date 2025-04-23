import type { Release } from '$lib/types/index.js';

export const load = async ({ fetch }) => {
	const releases: Release[] = await fetch('/api/releases').then((res) => res.json());

	return {
		releases
	};
};
