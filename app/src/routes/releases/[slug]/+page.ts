import type { ReleaseHydrated } from '../../../../../shared/types';

export const load = async ({ fetch, params }) => {
	const release: ReleaseHydrated = await fetch(`/api/releases/${params.slug}`).then((res) =>
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
