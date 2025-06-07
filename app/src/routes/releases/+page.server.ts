import type { ReleaseHydrated } from '../../../../shared/types';

export const load = async ({ fetch }) => {
	const releases: ReleaseHydrated[] = await fetch('/api/releases').then((res) => res.json());

	return {
		releases
	};
};
