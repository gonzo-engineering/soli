import type { ReleaseHydrated } from '$lib/types/index';

export const load = async ({ fetch }) => {
	const releases: ReleaseHydrated[] = await fetch('/api/releases').then((res) => res.json());

	return {
		releases
	};
};
