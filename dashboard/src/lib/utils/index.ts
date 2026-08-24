import { PUBLIC_GATEWAY_URL } from '$env/static/public';

export const makeImageLink = (cid: string, width: number) => {
	return `https://${PUBLIC_GATEWAY_URL}/ipfs/${cid}?img-width=${width}`;
};

export const genres = [
	'Ambient',
	'Blues',
	'Classical',
	'Country',
	'Dancehall',
	'Disco',
	'Drum & Bass',
	'Dub',
	'Electronic',
	'Folk',
	'Funk',
	'Gospel',
	'Grime',
	'Hip Hop',
	'House',
	'Indie',
	'Jazz',
	'Latin',
	'Metal',
	'New Age',
	'Opera',
	'Pop',
	'Punk',
	'R&B',
	'Reggae',
	'Rock',
	'Ska',
	'Soul',
	'Spoken Word',
	'Techno',
	'Trance',
	'World'
];
