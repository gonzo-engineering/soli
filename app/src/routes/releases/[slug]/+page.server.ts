import type { ReleaseHydrated } from '../../../../../shared/types';

export const load = async ({ fetch, params }) => {
	const releases: ReleaseHydrated[] = await fetch('/api/releases').then((res) => res.json());

	const matchingRelease = releases.find((release) => release.id === params.slug);

	if (!matchingRelease) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}

	return {
		release: matchingRelease
	};
};
