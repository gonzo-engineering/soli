import { TABLES } from '../../../../../shared/config';
import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import type { ArtistHydrated } from '../../../../../shared/types/hydrated';
import { json } from '@sveltejs/kit';
import { pinata } from '$lib/server/pinata';

export async function GET({ params }) {
	return handlePostgrestQuery<ArtistHydrated>(
		async () => await supabase.from(TABLES.artistsRich).select().eq('id', params.slug).single(),
		{ errorMessage: 'Failed to fetch artist' }
	);
}

export async function PATCH({ request, params }) {
	const formData = await request.formData();

	const artistImageNew = formData.get('artistImageNew') as File;
	const artistName = formData.get('artistName') as string;
	const artistBio = formData.get('artistBio') as string;
	const artistWebsite = formData.get('artistWebsite') as string;

	let imageCid: string | undefined;

	if (artistImageNew && artistImageNew.size > 0) {
		const pinataFileName = `${artistName} profile image`;
		const upload = await pinata.upload.public
			.file(artistImageNew)
			.name(pinataFileName)
			.group(import.meta.env.PINATA_ARTIST_IMAGES_GROUP);

		if (!upload || !upload.cid) {
			console.error('Error uploading artist image to Pinata:', upload);
		}
		// TODO: Delete old artist image if it exists
		imageCid = upload.cid;
	}

	const { error } = await supabase
		.from(TABLES.artists)
		.update({ artistName, artistBio, artistWebsite, imageCid })
		.eq('id', params.slug);
	if (error) {
		return json({ error: 'Failed to update artist details' }, { status: 500 });
	}
	return json({ success: true });
}
