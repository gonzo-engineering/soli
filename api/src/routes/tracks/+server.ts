import { json, type RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';
import { pinata } from '$lib/server/pinata';
import { TABLES } from '../../../../shared/config';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { artistId, title, artistName, artistGroup, durationSeconds, fileName } =
			await request.json();

		if (!artistId || !title || !fileName) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Upload to Pinata from storage
		// let upload;
		// try {
		// 	console.log(`Attempting to download file from Supabase storage: ${fileName}`);
		// 	const { data: fileData, error: downloadError } = await supabase.storage
		// 		.from('tracks')
		// 		.download(fileName);

		// 	if (downloadError || !fileData) throw downloadError;

		// 	const file = new File([fileData], fileName, { type: 'audio/mpeg' });
		// 	upload = await pinata.upload.private
		// 		.file(file)
		// 		.name(`${artistName} - ${title}`)
		// 		.group(artistGroup);
		// } catch (err) {
		// 	console.error('Pinata upload failed:', err);
		// 	return json({ error: 'Failed to upload to IPFS', detail: String(err) }, { status: 500 });
		// }

		const { error: insertError, data } = await supabase
			.from(TABLES.tracks)
			.insert({
				title,
				artist_id: artistId,
				duration_seconds: durationSeconds ?? 0,
				storage_path: fileName
			})
			.select()
			.single();

		if (insertError) {
			return json(
				{ error: 'Failed to save track metadata', detail: insertError.message },
				{ status: 500 }
			);
		}

		return json({ success: true, track: data });
	} catch (err) {
		console.error('Unexpected error:', err);
		return json({ error: 'Unexpected error', detail: String(err) }, { status: 500 });
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
