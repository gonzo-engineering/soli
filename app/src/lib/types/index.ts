export interface ArtistRaw {
	id: string;
	name: string;
	description: string;
	website: string;
	imageCID?: string;
}

export interface ArtistHydrated {
	id: string;
	name: string;
	description: string;
	website: string;
	imageLink?: string;
}

export interface TrackOld {
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
	tracks: TrackOld[];
}

export interface ReleaseHydrated {
	id: string;
	name: string;
	type: 'LP' | 'EP' | 'Single';
	artist: ArtistRaw;
	releaseDate: string;
	coverLink: string;
	tracks: TrackOld[];
}

// Types revised

export interface Track {
	name: string;
	duration_in_seconds: number;
	cid: string;
	url?: string; // URL to the track
}

export interface Release {
	id: string;
	title: string;
	// TODO: Handle addition of artistName to the release
	artistName?: string;
	type: 'LP' | 'EP' | 'Single';
	release_date: string;
	cover_cid: string;
	// TODO: Handle hydration of cover_cid to coverLink
	coverLink?: string;
	genres: string[];
	tracks: Track[];
}

export interface ArtistManifest {
	artist: {
		id: string;
		name: string;
		description: string;
		website: string;
		image_cid: string;
		// TODO: Handle hydration of image_cid to imageLink
		imageLink?: string;
	};
	releases: Release[];
}

export interface UserProfile {
	first_name: string;
	tokens_balance: number;
	pay_per_stream: number;
}

export interface UserState {
	activeSong: Track | null;
	activeSongArtist: ArtistManifest | null;
	liveBalance: number | null;
	payPerStream: number;
}
