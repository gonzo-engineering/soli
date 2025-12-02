import { form, getRequestEvent, query } from '$app/server';
import { API_BASE, DOMAIN_BASE, REQUEST_HEADER_BOILERPLATE } from '$lib/config';
import * as z from 'zod';
import type { Track } from '../../../../shared/types/core';
import { sortReleasesByDate } from '../../../../shared/utils';
import type { ReleaseHydrated } from '../../../../shared/types/hydrated';

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
	formData.append('artistName', data.artistName);
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

export const getArtistReleases = query(z.string(), async (artistId) => {
	const response = await fetch(`${API_BASE}/artists/${artistId}/releases`, {
		method: 'GET',
		headers: REQUEST_HEADER_BOILERPLATE
	});
	if (!response.ok) {
		throw new Error('Failed to fetch artist releases');
	}
	const releases = (await response.json()) as ReleaseHydrated[];
	const releasesSorted = sortReleasesByDate(releases);
	return releasesSorted;
});

export const getArtistTracks = query(z.string(), async (artistId) => {
	const response = await fetch(`${API_BASE}/artists/${artistId}/tracks`, {
		method: 'GET',
		headers: REQUEST_HEADER_BOILERPLATE
	});
	if (!response.ok) {
		throw new Error('Failed to fetch artist tracks');
	}
	const tracks = (await response.json()) as Track[];
	const tracksSorted = tracks.sort((a, b) => {
		if (a.title < b.title) return -1;
		if (a.title > b.title) return 1;
		return 0;
	});
	return tracksSorted;
});
