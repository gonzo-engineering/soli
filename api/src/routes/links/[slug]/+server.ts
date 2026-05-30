import { json, text } from '@sveltejs/kit';
import { pinata } from '$lib/server/pinata';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	if (!params.slug) {
		return json({ error: 'Missing CID' }, { status: 400 });
	}

	const url = await pinata.gateways.private.createAccessLink({
		cid: params.slug,
		expires: 5
	});

	if (!url) {
		return json({ error: 'Failed to fetch song URL' }, { status: 500 });
	}

	return text(url);
};
