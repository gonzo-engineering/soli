import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import { TABLES } from '@soli/shared/config';
import type { ReleaseHydrated, Release } from '@soli/shared/types';
import type { RequestHandler } from '@sveltejs/kit';
import { pinata } from '$lib/server/pinata';

export const GET: RequestHandler = async ({ params }) => {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	if (!params.slug || !uuidRegex.test(params.slug)) {
		return json({ error: 'Invalid release ID' }, { status: 400 });
	}
	return handlePostgrestQuery<ReleaseHydrated>(
		async () => await supabase.from(TABLES.releasesRich).select().eq('id', params.slug).single(),
		{ errorMessage: 'Failed to fetch release' }
	);
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const formData = await request.formData();

		const releaseName = formData.get('releaseName') as string;
		const releaseType = formData.get('releaseType') as string;
		const releaseDate = formData.get('releaseDate') as string;
		const releaseGenres = formData.get('releaseGenres') as string;
		const releaseArtwork = formData.get('releaseArtwork') as File | null;

		let artworkCid: string | undefined;

		if (releaseArtwork && releaseArtwork.size > 0) {
			const upload = await pinata.upload.public
				.file(releaseArtwork)
				.name(`'${releaseName}' cover art`)
				.group(import.meta.env.PINATA_ARTWORK_GROUP);
			artworkCid = upload.cid;
		}

		const updatePayload: Record<string, unknown> = {
			title: releaseName,
			release_type: releaseType,
			release_date: new Date(releaseDate).toISOString().split('T')[0],
			genres: releaseGenres ? releaseGenres.split(',').map((g) => g.trim()) : []
		};

		if (artworkCid) {
			updatePayload.artwork_ipfs_cid = artworkCid;
		}

		return handlePostgrestQuery<Release>(
			async () =>
				await supabase
					.from(TABLES.releases)
					.update(updatePayload)
					.eq('id', params.slug)
					.select()
					.single(),
			{ errorMessage: 'Failed to update release' }
		);
	} catch (error) {
		console.error(error);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	const { error } = await supabase.from(TABLES.releases).delete().eq('id', params.slug);

	if (error) {
		console.error('Error deleting release:', error);
		return json({ error: 'Failed to delete release' }, { status: 500 });
	}

	return json({ success: true });
};
