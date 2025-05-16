import { json, text } from '@sveltejs/kit';
import { getSongUrl } from '$lib/server/pinata';

export async function GET({ params, locals: { safeGetSession } }) {
	const session = await safeGetSession();

	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const url = await getSongUrl(params.slug);

	if (!url) {
		return json({ error: 'Failed to fetch song URL' }, { status: 500 });
	}

	return text(url);
}
