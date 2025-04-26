export interface Artist {
	id: string;
	name: string;
	description: string;
	website: string;
}

export interface Track {
	CID: string;
	name: string;
	durationInSeconds: number; // Duration in seconds
	url: string; // URL to the track
}

export interface ReleaseRaw {
	id: string;
	name: string;
	type: 'LP' | 'EP' | 'Single';
	artistCID: string;
	releaseDate: string;
	coverCID: string;
	tracks: Track[];
}

export interface ReleaseHydrated {
	id: string;
	name: string;
	type: 'LP' | 'EP' | 'Single';
	artist: Artist;
	releaseDate: string;
	coverLink: string;
	tracks: Track[];
}
