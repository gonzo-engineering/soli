import { command, form } from '$app/server';
import { API_BASE, DASHBOARD_BASE, REQUEST_HEADER_BOILERPLATE } from '$lib/config';
import * as z from 'zod';

const AddReleaseForm = z.object({
	artistId: z.string(),
	releaseArtwork: z.instanceof(File),
	releaseName: z.string().min(1),
	releaseType: z.enum(['album', 'ep', 'single']),
	releaseDate: z.string(),
	releaseGenres: z.array(z.string()).optional()
});

const EditReleaseFormSchema = z.object({
	releaseId: z.string(),
	releaseName: z.string().min(1),
	releaseType: z.enum(['album', 'ep', 'single']),
	releaseDate: z.string(),
	releaseGenres: z.string().optional(),
	releaseArtwork: z.instanceof(File).optional()
});

const UploadTrackForm = z.object({
	audioFile: z.instanceof(File),
	artistId: z.string(),
	title: z.string().min(1),
	artistName: z.string().min(1),
	artistGroup: z.string().optional()
});

const AddTrackToReleaseForm = z.object({
	releaseId: z.string(),
	trackId: z.string(),
	trackNumber: z.number()
});

export const addRelease = form(AddReleaseForm, async (data) => {
	const formData = new FormData();
	formData.append('artistId', data.artistId);
	formData.append('releaseArtwork', data.releaseArtwork);
	formData.append('releaseName', data.releaseName);
	formData.append('releaseType', data.releaseType);
	formData.append('releaseDate', data.releaseDate);
	await fetch(`${API_BASE}/releases`, {
		method: 'POST',
		headers: {
			origin: DASHBOARD_BASE
		},
		body: formData
	});
});

export const editRelease = form(EditReleaseFormSchema, async (data) => {
	const formData = new FormData();
	formData.append('releaseName', data.releaseName);
	formData.append('releaseType', data.releaseType);
	formData.append('releaseDate', data.releaseDate);
	formData.append('releaseGenres', data.releaseGenres ?? '');
	if (data.releaseArtwork && data.releaseArtwork.size > 0) {
		formData.append('releaseArtwork', data.releaseArtwork);
	}
	await fetch(`${API_BASE}/releases/${data.releaseId}`, {
		method: 'PATCH',
		headers: { origin: DASHBOARD_BASE },
		body: formData
	});
});

export const uploadTrack = form(UploadTrackForm, async (data) => {
	const formData = new FormData();
	formData.append('audioFile', data.audioFile);
	formData.append('artistId', data.artistId);
	formData.append('title', data.title);
	formData.append('artistName', data.artistName);
	if (data.artistGroup) {
		formData.append('artistGroup', data.artistGroup);
	}
	await fetch(`${API_BASE}/tracks`, {
		method: 'POST',
		headers: {
			origin: DASHBOARD_BASE
		},
		body: formData
	});
});

export const addTrackToRelease = form(AddTrackToReleaseForm, async (data) => {
	await fetch(`${API_BASE}/tracks`, {
		method: 'PATCH',
		headers: REQUEST_HEADER_BOILERPLATE,
		body: JSON.stringify(data)
	});
});

const RemoveTrackFromReleaseSchema = z.object({
	releaseId: z.string(),
	trackId: z.string()
});

export const removeTrackFromRelease = command(RemoveTrackFromReleaseSchema, async (data) => {
	await fetch(`${API_BASE}/releases/${data.releaseId}/tracks/${data.trackId}`, {
		method: 'DELETE',
		headers: REQUEST_HEADER_BOILERPLATE
	});
});

export const deleteTrack = command(z.string(), async (trackId) => {
	await fetch(`${API_BASE}/tracks/${trackId}`, {
		method: 'DELETE',
		headers: REQUEST_HEADER_BOILERPLATE
	});
});

export const deleteRelease = command(z.string(), async (releaseId) => {
	await fetch(`${API_BASE}/releases/${releaseId}`, {
		method: 'DELETE',
		headers: REQUEST_HEADER_BOILERPLATE
	});
});
