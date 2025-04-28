import { PinataSDK } from 'pinata';
import { PINATA_JWT, PINATA_GROUP_MANIFESTS } from '$env/static/private';
import { PUBLIC_GATEWAY_URL } from '$env/static/public';
import type { ArtistManifest } from '$lib/types';

export const pinata = new PinataSDK({
	pinataJwt: `${PINATA_JWT}`,
	pinataGateway: `${PUBLIC_GATEWAY_URL}`
});

export const pinataGroups = {
	manifests: PINATA_GROUP_MANIFESTS
};

export const getManifests = async () => {
	const manifests = await pinata.files.public.list().group(pinataGroups.manifests);

	const allManifests = (await Promise.all(
		manifests.files.map(async (manifest) => {
			const { data } = await pinata.gateways.public.get(manifest.cid);
			return data;
		})
	)) as unknown as ArtistManifest[];
	return allManifests;
};
