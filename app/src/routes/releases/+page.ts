import type { ReleaseHydrated } from '$lib/types/index.js';

export const load = async ({ fetch }) => {
	const allReleases: ReleaseHydrated[] = await fetch('/api/releases').then((res) => res.json());

	return {
		allReleases
	};
};
