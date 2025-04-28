import { fail, json, type Actions } from '@sveltejs/kit';
import { pinata } from '$lib/server/pinata';

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			const formData = await request.formData();
			const uploadedFile = formData?.get('fileToUpload') as File;
			const uploadedFileTitle = formData?.get('title') as string;
			const uploadedFileArtist = formData?.get('artist') as string;
			const uploadedFileRelease = formData?.get('release') as string;

			if (!uploadedFile.name || uploadedFile.size === 0) {
				return fail(400, {
					error: true,
					message: 'You must provide a file to upload'
				});
			}

			const upload = await pinata.upload.public
				.file(uploadedFile)
				.name(uploadedFileTitle)
				.keyvalues({
					artist: uploadedFileArtist,
					release: uploadedFileRelease
				});

			const url = await pinata.gateways.public.convert(upload.cid);
			return { url, filename: uploadedFile.name, status: 200 };
		} catch (error) {
			console.log(error);
			return json({ error: 'Internal Server Error' }, { status: 500 });
		}
	}
};
