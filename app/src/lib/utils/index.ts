import { PUBLIC_GATEWAY_URL } from '$env/static/public';

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
