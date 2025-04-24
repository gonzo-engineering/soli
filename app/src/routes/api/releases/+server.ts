import { json } from '@sveltejs/kit';

import type { Release } from '$lib/types/index.js';

const artists: Release[] = [
	{
		id: '78j3h3j3-4f5g-6h7i-8j9k-0l1m2n3o4p5q',
		name: 'Better',
		artistID: '0x1234567890abcdef',
		releaseDate: '2023-10-01',
		coverID: '71c2e4f3-8b1a-4d5b-9f0c-6a7e8d1f2e3b'
	},
	{
		id: '9a8b7c6d-5e4f-3g2h-1i0j-k9l8m7n6o5p4',
		name: 'West to East',
		artistID: '0x1234567890abcdef',
		releaseDate: '2023-10-02',
		coverID: '71c2e4f3-8b1a-4d5b-9f0c-6a7e8d1f2e3b'
	}
];

export async function GET() {
	return json(artists);
}
