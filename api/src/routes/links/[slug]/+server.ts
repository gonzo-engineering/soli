import { json, text } from '@sveltejs/kit';
import { getSongUrl } from '$lib/server/pinata';

export async function GET({ params }) {
	const url = await getSongUrl(params.slug);

	if (!url) {
		return json({ error: 'Failed to fetch song URL' }, { status: 500 });
	}

	return text(url);
}
