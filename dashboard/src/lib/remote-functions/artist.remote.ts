import { form, getRequestEvent, query } from '$app/server';
import { API_BASE, DOMAIN_BASE } from '$lib/config';
import * as z from 'zod';

const ArtistDetailsForm = z.object({
	artistId: z.string(),
	artistName: z.string().min(1),
	artistImageNew: z.instanceof(File).optional(),
	artistBio: z.string().max(1000).optional(),
	artistWebsite: z.string().optional()
});

export const updateArtistDetails = form(ArtistDetailsForm, async (data) => {
	const formData = new FormData();
	if (data.artistImageNew) {
		formData.append('artistImageNew', data.artistImageNew);
	}
	formData.append('artistId', data.artistId);
	formData.append('artistBio', data.artistBio || '');
	formData.append('artistWebsite', data.artistWebsite || '');
	await fetch(`${API_BASE}/artists/${data.artistId}`, {
		method: 'PATCH',
		headers: {
			origin: DOMAIN_BASE
		},
		body: formData
	});
});

export const signOut = query(async () => {
	const { locals } = getRequestEvent();
	if (locals.session) {
		await locals.supabase.auth.signOut();
	}
});
