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
			return json({ error: 'Missing required fields', fields: { file: !!file, artistId: !!artistId, title: !!title } }, { status: 400 });
		}

		// Get duration
		let duration: number;
		try {
			duration = await getAudioFileDuration(file);
		} catch (err) {
			console.error('Failed to parse audio metadata:', err);
			return json({ error: 'Failed to read audio file — it may be corrupt or an unsupported format', detail: String(err) }, { status: 400 });
		}

		// Upload to Pinata
		let upload;
		try {
			upload = await pinata.upload.private
				.file(file)
				.name(`${artistName} - ${title}`)
				.group(artistGroup);
			console.log('Pinata upload successful:', upload);
		} catch (err) {
			console.error('Pinata upload failed:', err);
			return json({ error: 'Failed to upload to IPFS', detail: String(err) }, { status: 500 });
		}

		// Insert metadata into Supabase
		const { error: insertError, data } = await supabase
			.from(TABLES.tracks)
			.insert({
				title,
				ipfs_cid: upload.cid,
				artist_id: artistId,
				duration_seconds: duration
			})
			.select()
			.single();

		if (insertError) {
			console.error('Supabase row insert failed:', insertError);
			return json({ error: 'Failed to save track metadata', detail: insertError.message }, { status: 500 });
		}

		console.log('Supabase insert successful:', data);

		// Upload file to Supabase storage
		const bucketFileName = `${data.id}.mp3`;
		const { error: storageError } = await supabase.storage
			.from('tracks')
			.upload(bucketFileName, file);

		if (storageError) {
			console.error('Supabase storage upload failed:', storageError);
			// Row was inserted but file upload failed — flag this clearly
			return json({
				error: 'Track metadata saved but file upload to storage failed',
				detail: storageError.message,
				trackId: data.id
			}, { status: 500 });
		}

		console.log('Supabase storage upload successful:', bucketFileName);

		return json({ success: true, track: data });

	} catch (err) {
		console.error('Unexpected error during upload:', err);
		return json({ error: 'Unexpected error during upload', detail: String(err) }, { status: 500 });
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
