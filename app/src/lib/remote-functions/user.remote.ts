import { form, query } from '$app/server';
import { API_BASE, REQUEST_HEADER_BOILERPLATE } from '$lib/global/config';
import * as z from 'zod';
import { requireAuth } from './auth-check';

const ToggleLikedTrackForm = z.object({
	trackId: z.string(),
	addOrRemove: z.enum(['add', 'remove'])
});

const ToggleFollowedArtistForm = z.object({
	artistID: z.string(),
	addOrRemove: z.enum(['add', 'remove'])
});

export const toggleFollowedArtist = form(
	ToggleFollowedArtistForm,
	async ({ artistID, addOrRemove }) => {
		const userId = requireAuth().id;

		await fetch(`${API_BASE}/users/${userId}/following`, {
			method: addOrRemove === 'remove' ? 'DELETE' : 'POST',
			headers: REQUEST_HEADER_BOILERPLATE,
			body: JSON.stringify({ artistId: artistID })
		});
	}
);

export const toggleLikedTrack = form(ToggleLikedTrackForm, async ({ trackId, addOrRemove }) => {
	const userId = requireAuth().id;

	await fetch(`${API_BASE}/users/${userId}/likes`, {
		method: addOrRemove === 'remove' ? 'DELETE' : 'POST',
		headers: REQUEST_HEADER_BOILERPLATE,
		body: JSON.stringify({ trackId })
	});
});

export const updateUserTokensBalance = query(
	z.object({
		userId: z.string(),
		tokens: z.number(),
		addOrSubtract: z.enum(['add', 'subtract'])
	}),
	async ({ userId, tokens, addOrSubtract }) => {
		const balanceChange = addOrSubtract === 'add' ? tokens : -tokens;
		const response = await fetch(`${API_BASE}/users/${userId}`, {
			method: 'PATCH',
			headers: REQUEST_HEADER_BOILERPLATE,
			body: JSON.stringify({ balanceChange })
		});

		if (!response.ok) {
			console.error('Error updating user balance:', response.statusText);
		}
		const data = await response.json();
		return { data, error: response.ok ? null : new Error(response.statusText) };
	}
);
