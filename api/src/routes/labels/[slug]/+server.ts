import { pinata } from '$lib/server/pinata';
import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import { TABLES } from '../../../../../shared/config';
import type { Label } from '../../../../../shared/types/core';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	return handlePostgrestQuery<Label>(
		async () => await supabase.from(TABLES.labelsRich).select().eq('id', params.slug).single(),
		{ errorMessage: 'Failed to fetch label' }
	);
};

export const PATCH: RequestHandler = async ({ request, params }) => {
	const formData = await request.formData();

	const labelImageNew = formData.get('labelImageNew') as File;
	const labelName = formData.get('labelName') as string;
	const labelDescription = formData.get('labelDescription') as string;
	const labelWebsite = formData.get('labelWebsite') as string;

	let imageCid: string | undefined;

	if (labelImageNew && labelImageNew.size > 0) {
		const pinataFileName = `${labelName} profile image`;
		const upload = await pinata.upload.public
			.file(labelImageNew)
			.name(pinataFileName)
			.group(import.meta.env.PINATA_LABEL_IMAGES_GROUP);

		if (!upload || !upload.cid) {
			console.error('Error uploading label image to Pinata:', upload);
		}
		// TODO: Delete old label image if it exists
		imageCid = upload.cid;
	}

	const { error } = await supabase
		.from(TABLES.labels)
		.update({
			name: labelName,
			description: labelDescription,
			website_url: labelWebsite,
			image_cid: imageCid
		})
		.eq('id', params.slug);
	if (error) {
		return json({ error: 'Failed to update label details' }, { status: 500 });
	}
	return json({ success: true });
};
