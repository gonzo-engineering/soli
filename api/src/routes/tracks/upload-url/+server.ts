import { supabase } from '$lib/server/supabase';
import { json, type RequestHandler } from '@sveltejs/kit';
import { TABLES } from '../../../../../shared/config';

export const POST: RequestHandler = async ({ request }) => {
	const { artistId, title, durationSeconds } = await request.json();

	if (!artistId || !title) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const { error: insertError, data } = await supabase
		.from(TABLES.tracks)
		.insert({
			title,
			artist_id: artistId,
			duration_seconds: durationSeconds ?? 0
		})
		.select()
		.single();

	if (insertError) {
		return json({ error: 'Failed to create track', detail: insertError.message }, { status: 500 });
	}

	const fileName = `${data.id}.mp3`;
	const { data: uploadData, error: urlError } = await supabase.storage
		.from('tracks')
		.createSignedUploadUrl(fileName);

	if (urlError) {
		await supabase.from(TABLES.tracks).delete().eq('id', data.id);
		return json(
			{ error: 'Failed to create upload URL', detail: urlError.message },
			{ status: 500 }
		);
	}

	return json({ token: uploadData.token, fileName, trackId: data.id });
};
