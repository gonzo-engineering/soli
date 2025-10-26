import { query } from '$app/server';
import { API_BASE } from '$lib/global/config';
import * as z from 'zod';
import type { ReleaseHydrated } from '../../../../shared/types/hydrated';

export const getHydratedRelease = query(z.string(), async (releaseId: string) => {
	const response = await fetch(`${API_BASE}/releases/${releaseId}`);
	if (!response.ok) throw new Error('Failed to fetch release');
	const release: ReleaseHydrated = await response.json();
	return release;
});
