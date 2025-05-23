export interface UserProfile {
	first_name: string;
	tokens_balance: number;
	pay_per_stream: number;
}

export interface UserState {
	activeSong: TrackRaw | null;
	activeSongUrl: string | null;
	activeSongArtist: {
		artistId: string;
		artistName: string;
	} | null;
	scheduledSongs: TrackRaw[];
	activeSongIsPaused: boolean;
	liveBalance: number | null;
	payPerStream: number;
}

export interface ArtistRaw {
	id: string;
	name: string;
	bio?: string;
	website_url?: string;
	stripe_account_id: string;
	created_at: string;
	image_ipfs_cid?: string;
}

export interface TrackRaw {
	id: string;
	artist_id: string;
	release_id: string;
	title: string;
	ipfs_cid: string;
	manifest_cid?: string;
	duration_seconds: number;
	created_at: string;
}

export interface ReleaseHydrated {
	id: string;
	title: string;
	artwork_ipfs_cid: string;
	release_type: string;
	release_date: string;
	artist_id: string;
	artist_name: string;
	tags: string[];
	tracks: TrackRaw[];
}

// Not currently using as the API returns the hydrated version

// export interface ReleaseRaw {
// 	id: string;
// 	artist_id: string;
// 	title: string;
// 	release_type: string;
// 	artwork_ipfs_cid: string;
// 	release_date: string;
// 	tags: string[];
// 	ipfs_manifest_cid?: string;
// 	created_at: string;
// 	updated_at: string;
// }
