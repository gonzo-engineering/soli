export interface Artist {
	id: string;
	name: string;
}

export interface Release {
	id: string;
	name: string;
	artistId: string;
	releaseDate: string;
	coverArt: string;
}

export interface Track {
	id: string;
	name: string;
	releaseId: string;
	trackNumber: number;
}
