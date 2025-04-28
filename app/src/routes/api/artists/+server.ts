// Returns all the artist manifests

import { json } from '@sveltejs/kit';
import { getManifests } from '$lib/server/pinata';

export async function GET() {
	const allManifests = await getManifests();

	return json(allManifests);
}
