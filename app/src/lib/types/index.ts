export interface Artist {
	id: string;
	name: string;
}

export interface Release {
	id: string;
	name: string;
	artistID: string;
	releaseDate: string;
	coverID: string;
}

export interface Track {
	id: string;
	name: string;
	artistID: string;
	releaseID: string;
	trackNumber: number;
}
