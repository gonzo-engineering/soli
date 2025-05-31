import { PUBLIC_GATEWAY_URL } from '$env/static/public';
import type { ReleaseHydrated } from '$lib/types';

export const prettifyDuration = (durationInSeconds: number) => {
	const minutes = Math.floor(durationInSeconds / 60);
	const seconds = durationInSeconds % 60;
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const prettifyBalance = (tokensBalance: number) => {
	return tokensBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const prettifyPennies = (pence: number) => {
	const pounds = Math.floor(pence / 100);
	const pennies = pence % 100;
	return `£${pounds}.${pennies < 10 ? '0' : ''}${pennies}`;
};

export const makeImageLink = (cid: string, width: number) => {
	return `https://${PUBLIC_GATEWAY_URL}/ipfs/${cid}?img-width=${width}`;
};

export const formatReleaseType = (type: string) => {
	switch (type) {
		case 'single':
			return 'Single';
		case 'album':
			return 'Album';
		case 'ep':
			return 'EP';
		default:
			return type;
	}
};

export const sortReleasesByDate = (releases: ReleaseHydrated[]) => {
	return releases.sort((a, b) => {
		return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
	});
};
