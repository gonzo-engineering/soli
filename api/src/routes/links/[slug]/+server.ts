import { json, text } from '@sveltejs/kit';
import { pinata } from '$lib/server/pinata';

export async function GET({ params }) {
	const url = await pinata.gateways.private.createAccessLink({
		cid: params.slug,
		expires: 5
	});

	if (!url) {
		return json({ error: 'Failed to fetch song URL' }, { status: 500 });
	}

	return text(url);
}
