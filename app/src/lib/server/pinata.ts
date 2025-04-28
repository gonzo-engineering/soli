import { PinataSDK } from 'pinata';
import {
	PINATA_JWT,
	PINATA_GROUP_ARTISTS,
	PINATA_GROUP_MANIFESTS,
	PINATA_GROUP_RELEASES
} from '$env/static/private';
import { PUBLIC_GATEWAY_URL } from '$env/static/public';

export const pinata = new PinataSDK({
	pinataJwt: `${PINATA_JWT}`,
	pinataGateway: `${PUBLIC_GATEWAY_URL}`
});

export const pinataGroups = {
	artists: PINATA_GROUP_ARTISTS,
	releases: PINATA_GROUP_RELEASES,
	manifests: PINATA_GROUP_MANIFESTS
};
