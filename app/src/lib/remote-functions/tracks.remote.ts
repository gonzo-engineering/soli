import { form } from '$app/server';
import { API_BASE } from '$lib/global/config';
import * as z from 'zod';
import { requireAuth } from './auth-check';

const ToggleLikedTrackForm = z.object({
	trackId: z.string(),
	addOrRemove: z.enum(['add', 'remove'])
});

export const toggleLikedTrack = form(ToggleLikedTrackForm, async ({ trackId, addOrRemove }) => {
	const userId = requireAuth().id;

	await fetch(`${API_BASE}/users/${userId}/likes`, {
		method: addOrRemove === 'remove' ? 'DELETE' : 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ trackId })
	});
});
