import { json, type RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';
import { pinata } from '$lib/server/pinata';
import { TABLES } from '../../../../shared/config';
import { parseFile } from 'music-metadata';
import fs from 'fs/promises';

const getAudioFileDuration = async (file: File) => {
	// Write to temporary file system
	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);
	const tempPath = `/tmp/${file.name}`;

	await fs.writeFile(tempPath, buffer);

	const metadata = await parseFile(tempPath);
	const duration = Math.round(metadata.format.duration || 0);

	await fs.unlink(tempPath); // Clean up temporary file

	return duration;
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();

		const file = formData.get('file') as File;
		const artistId = formData.get('artistId') as string;
		const title = formData.get('title') as string;
		const artistName = formData.get('artistName') as string;
		const artistGroup = formData.get('artistGroup') as string;

		if (!file || !artistId || !title) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const duration = await getAudioFileDuration(file);

		// Upload to Pinata
		const upload = await pinata.upload.private
			.file(file)
			.name(`${artistName} - ${title}`)
			.group(artistGroup);

		// Insert into Supabase
		const { error, data } = await supabase
			.from(TABLES.tracks)
			.insert({
				title,
				ipfs_cid: upload.cid,
				artist_id: artistId,
				duration_seconds: duration
			})
			.select()
			.single();

		const bucketFileName = `${data.id}.mp3`;

		const { error: supabaseError } = await supabase.storage
			.from('tracks')
			.upload(bucketFileName, file);

		if (error) {
			console.error('Supabase row insert failed:', error);
			return json({ error: 'Failed to save track metadata' }, { status: 500 });
		}

		// Uploading to Supabase as well as a backup
		if (supabaseError) {
			console.error('Supabase file upload failed:', supabaseError);
			return json({ error: 'Failed to upload track file' }, { status: 500 });
		}

		return json({ success: true, track: data });
	} catch (err) {
		console.error('Upload failed:', err);
		return json({ error: 'Upload failed' }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ request }) => {
	const { releaseId, trackId, trackNumber } = await request.json();

	if (!releaseId || !trackId || trackNumber == null) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const { error } = await supabase.from(TABLES.releaseTracks).insert({
		release_id: releaseId,
		track_id: trackId,
		track_number: parseInt(trackNumber)
	});

	if (error) {
		console.error('Error inserting track into release:', error);
		return json({ error: 'Failed to add track to release' }, { status: 500 });
	}

	return json({ success: true });
};
