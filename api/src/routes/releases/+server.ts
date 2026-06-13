import { handlePostgrestQuery, supabase } from '$lib/server/supabase';
import { TABLES } from '@soli/shared/config';
import { sortReleasesByDate } from '@soli/shared/utils';
import type { ReleaseHydrated } from '@soli/shared/types';
import { pinata } from '$lib/server/pinata';
import { json } from '@sveltejs/kit';
import type { Release } from '@soli/shared/types';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return handlePostgrestQuery<ReleaseHydrated[]>(
		async () => await supabase.from(TABLES.releasesRich).select(),
		{
			errorMessage: 'Failed to fetch artist data',
			transform: sortReleasesByDate
		}
	);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();

		const releaseArtwork = formData.get('releaseArtwork') as File;
		const releaseName = formData.get('releaseName') as string;
		const releaseType = formData.get('releaseType') as string;
		const artistId = formData.get('artistId') as string;
		const releaseDate = formData.get('releaseDate') as string;
		const releaseGenres = formData.get('releaseGenres') as string;

		const upload = await pinata.upload.public
			.file(releaseArtwork)
			.name(`'${releaseName}' cover art`)
			.group(import.meta.env.PINATA_ARTWORK_GROUP);

		return handlePostgrestQuery<Release>(
			async () =>
				await supabase
					.from(TABLES.releases)
					.insert({
						title: releaseName,
						release_type: releaseType,
						artist_id: artistId,
						artwork_ipfs_cid: upload.cid,
						release_date: new Date(releaseDate).toISOString().split('T')[0],
						genres: releaseGenres ? releaseGenres.split(',').map((genre) => genre.trim()) : []
					})
					.select()
					.single(),
			{ errorMessage: 'Failed to create new release' }
		);
	} catch (error) {
		console.log(error);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
};
