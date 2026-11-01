import { PinataSDK } from 'pinata';
import { PINATA_JWT } from '$app/env/private';
import { PUBLIC_GATEWAY_URL } from '$app/env/public';

export const pinata = new PinataSDK({
	pinataJwt: `${PINATA_JWT}`,
	pinataGateway: `${PUBLIC_GATEWAY_URL}`
});
