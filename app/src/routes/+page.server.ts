// import { PinataSDK } from 'pinata';
// import { PUBLIC_GATEWAY_URL } from '$env/static/public';
// import { PINATA_JWT } from '$env/static/private';
import type { Artist, Release } from '$lib/types/index.js';

// const pinata = new PinataSDK({
// 	pinataJwt: PINATA_JWT,
// 	pinataGateway: PUBLIC_GATEWAY_URL
// });

export const load = async ({ fetch }) => {
	// const { files } = await pinata.files.public.list();

	const releases: Release[] = await fetch('/api/releases').then((res) => res.json());
	const artists: Artist[] = await fetch('/api/artists').then((res) => res.json());

	// const songs = await Promise.all(
	// 	files.map(async (file) => {
	// 		const songURL = await pinata.gateways.public.convert(file.cid);
	// 		return {
	// 			name: file.name,
	// 			artist: file.keyvalues.artist,
	// 			release: file.keyvalues.release,
	// 			url: songURL
	// 		};
	// 	})
	// );

	return {
		releases,
		artists
	};
};
