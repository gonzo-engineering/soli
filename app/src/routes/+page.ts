import { API_BASE } from '$lib/global/config';
import type { ArtistRaw, ReleaseHydrated } from '../../../shared/types';

export const load = async ({ fetch }) => {
	const artists: ArtistRaw[] = await fetch(`${API_BASE}/artists`).then((res) => res.json());
	const releases: ReleaseHydrated[] = await fetch(`${API_BASE}/releases`).then((res) => res.json());

	return {
		artists,
		releases
	};
};
