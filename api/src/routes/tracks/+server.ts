import { json, type RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';
import { pinata } from '$lib/server/pinata';
import { TABLES } from '../../../../shared/config';
import { formFieldNames } from '../../../../shared/types/forms';
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

		const file = formData.get(formFieldNames.track.file) as File;
		const artistId = formData.get(formFieldNames.track.artistID) as string;
		const title = formData.get(formFieldNames.track.title) as string;
		const artistName = formData.get(formFieldNames.track.artistName) as string;
		const artistGroup = formData.get(formFieldNames.track.artistGroup) as string;

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

		if (error) {
			console.error('Supabase insert failed:', error);
			return json({ error: 'Failed to save track metadata' }, { status: 500 });
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
