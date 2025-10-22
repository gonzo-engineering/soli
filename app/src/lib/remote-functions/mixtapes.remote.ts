import { form } from '$app/server';
import { API_BASE } from '$lib/global/config';
import * as z from 'zod';
import { requireAuth } from './auth-check';

const MakeMixtapeForm = z.object({
	name: z.string().min(3).max(100),
	description: z.string().max(500).optional()
});

const AddTrackToMixtape = z.object({
	mixtapeId: z.string(),
	trackId: z.string()
});

export const makeMixtape = form(MakeMixtapeForm, async ({ name, description }) => {
	const userId = requireAuth().id;
	await fetch(`${API_BASE}/mixtapes`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ userId, name, description })
	});
});

export const addTrackToMixtape = form(AddTrackToMixtape, async ({ mixtapeId, trackId }) => {
	await fetch(`${API_BASE}/mixtapes/${mixtapeId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ trackId })
	});
});
