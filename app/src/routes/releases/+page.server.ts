import { pinata } from '$lib/server/pinata';
import type { Release } from '$lib/types/index';

export const load = async ({ fetch }) => {
	const releases: Release[] = await fetch('/api/releases').then((res) => res.json());

	const releasesWithLinks = await Promise.all(
		releases.map(async (release) => {
			const coverLink = await pinata.gateways.public.convert(release.cover_cid);
			return {
				...release,
				coverLink
			};
		})
	);

	return {
		releases: releasesWithLinks
	};
};
