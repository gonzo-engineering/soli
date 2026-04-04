import { query } from '$app/server';
import { API_BASE, REQUEST_HEADER_BOILERPLATE } from '$lib/global/config';
import * as z from 'zod';

export const getTrackUrl = query(z.string(), async (trackId: string) => {
	return await fetch(`${API_BASE}/media/${trackId}`, {
		headers: REQUEST_HEADER_BOILERPLATE
	}).then((res) => res.text());
});

export const logStream = query(
	z.object({
		streamId: z.string(),
		userId: z.string(),
		artistId: z.string(),
		trackId: z.string(),
		tokensUsed: z.number()
	}),
	async ({ streamId, userId, artistId, trackId, tokensUsed }) => {
		const { status } = await fetch(`${API_BASE}/streams`, {
			method: 'POST',
			headers: REQUEST_HEADER_BOILERPLATE,
			body: JSON.stringify({ streamId, userId, artistId, trackId, tokensUsed })
		});
		if (status === 200) {
			console.log('Stream logged successfully');
		} else {
			console.error('Error logging stream:', status);
		}
	}
);
