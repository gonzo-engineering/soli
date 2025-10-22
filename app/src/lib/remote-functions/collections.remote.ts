import { form } from '$app/server';
import { API_BASE } from '$lib/global/config';
import * as z from 'zod';

const MakeCollectionForm = z.object({
	userId: z.string(),
	name: z.string().min(3).max(100),
	description: z.string().max(500).optional(),
});

const DeleteCollectionForm = z.object({
    userId: z.string(),
    collectionId: z.string(),
});

const AddOrRemoveReleaseForm = z.object({
    collectionId: z.string(),
    releaseId: z.string(),
    addOrRemove: z.enum(['add', 'remove']),
});

export const makeCollection = form(
	MakeCollectionForm,
	async ({ userId, name, description }) => {
		await fetch(`${API_BASE}/collections`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ userId, name, description })
		});
	}
);

export const deleteCollection = form(
    DeleteCollectionForm,
    async ({ userId, collectionId }) => {
        await fetch(`${API_BASE}/collections/${collectionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });
    }
);

export const addOrRemoveRelease = form(
    AddOrRemoveReleaseForm,
    async ({ collectionId, releaseId, addOrRemove }) => {
        await fetch(`${API_BASE}/collections/${collectionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ releaseId, addOrRemove })
        });
    }
);