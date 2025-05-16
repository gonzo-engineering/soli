import { PinataSDK } from 'pinata';
import { PINATA_JWT, PINATA_GROUP_MANIFESTS } from '$env/static/private';
import { PUBLIC_GATEWAY_URL } from '$env/static/public';

export const pinata = new PinataSDK({
	pinataJwt: `${PINATA_JWT}`,
	pinataGateway: `${PUBLIC_GATEWAY_URL}`
});

export const pinataGroups = {
	manifests: PINATA_GROUP_MANIFESTS
};

export const getSongUrl = async (cid: string) => {
	const url = await pinata.gateways.private.createAccessLink({
		cid,
		expires: 5
	});
	return url;
};
