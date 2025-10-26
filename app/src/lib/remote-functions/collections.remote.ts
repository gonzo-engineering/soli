import { form } from '$app/server';
import { API_BASE, REQUEST_HEADER_BOILERPLATE } from '$lib/global/config';
import * as z from 'zod';
import { requireAuth } from './auth-check';

const MakeCollectionForm = z.object({
	name: z.string().min(3).max(100),
	description: z.string().max(500).optional()
});

const DeleteCollectionForm = z.object({
	collectionId: z.string()
});

const AddOrRemoveReleaseFromCollectionForm = z.object({
	collectionId: z.string(),
	releaseId: z.string(),
	addOrRemove: z.enum(['add', 'remove'])
});

export const makeCollection = form(MakeCollectionForm, async ({ name, description }) => {
	const userId = requireAuth().id;
	await fetch(`${API_BASE}/collections`, {
		method: 'POST',
		headers: REQUEST_HEADER_BOILERPLATE,
		body: JSON.stringify({ userId, name, description })
	});
});

export const deleteCollection = form(DeleteCollectionForm, async ({ collectionId }) => {
	const userId = requireAuth().id;
	await fetch(`${API_BASE}/collections/${collectionId}`, {
		method: 'DELETE',
		headers: REQUEST_HEADER_BOILERPLATE,
		body: JSON.stringify({ userId })
	});
});

export const addOrRemoveReleaseFromCollection = form(
	AddOrRemoveReleaseFromCollectionForm,
	async ({ collectionId, releaseId, addOrRemove }) => {
		await fetch(`${API_BASE}/collections/${collectionId}`, {
			method: 'PATCH',
			headers: REQUEST_HEADER_BOILERPLATE,
			body: JSON.stringify({ releaseId, addOrRemove })
		});
	}
);
