import { json } from '@sveltejs/kit';

import type { Artist } from '$lib/types/index.js';

const artists: Artist[] = [
	{
		id: '0x1234567890abcdef',
		name: 'Thomas Ashby',
		description:
			'Weaving a rich tapestry of folk, blues, and jazz, Thomas Ashby brings the spirit of the bard to the 21st century.',
		website: 'https://thomasashby.co.uk'
	}
];

export async function GET() {
	return json(artists);
}
