import { query } from '$app/server';
import { API_BASE, REQUEST_HEADER_BOILERPLATE } from '$lib/config';
import * as z from 'zod';

export const getArtistsStreams = query(z.string(), async (artistId) => {
	const response = await fetch(`${API_BASE}/artists/${artistId}/streams`, {
		method: 'GET',
		headers: REQUEST_HEADER_BOILERPLATE
	});
	if (!response.ok) {
		throw new Error('Failed to fetch artist streams');
	}
	return response.json();
});
