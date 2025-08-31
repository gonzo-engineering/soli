import { API_BASE } from '$lib/global/config';
import type { ArtistRaw } from '../../../../shared/types';

export const load = async ({ fetch }) => {
	const artists: ArtistRaw[] = await fetch(`${API_BASE}/artists`).then((res) => res.json());

	return {
		artists
	};
};
