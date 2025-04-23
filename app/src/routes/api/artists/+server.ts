import { json } from '@sveltejs/kit';

import type { Artist } from '$lib/types/index.js';

const artists: Artist[] = [
	{
		id: '0x1234567890abcdef',
		name: 'Thomas Ashby'
	}
];

export async function GET() {
	return json(artists);
}
