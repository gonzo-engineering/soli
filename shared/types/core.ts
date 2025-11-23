import type { ReleaseHydrated } from './hydrated';

export interface User {
	first_name: string;
	tokens_balance: number;
	pay_per_stream: number;
}

export interface Artist {
	id: string;
	name: string;
	bio?: string;
	website_url?: string;
	stripe_account_id: string;
	pinata_group_id: string;
	image_ipfs_cid?: string;
}

export interface Track {
	id: string;
	artist_id: string;
	title: string;
	ipfs_cid: string;
	duration_seconds: number;
}

export interface Release {
	id: string;
	artist_id: string;
	title: string;
	release_type: 'album' | 'ep' | 'single';
	artwork_ipfs_cid: string;
	release_date: string;
	tags: string[];
	genres: string[];
}

export interface Mixtape {
	id: string;
	user_id: string;
	name: string;
	description: string | null;
}

export interface SearchResult {
	type: 'artist' | 'release' | 'track';
	id: string;
	name: string;
	image_cid?: string;
}

export interface Collection {
	id: string;
	user_id: string;
	name: string;
	description?: string;
}

export interface StreamLog {
	id: string;
	streamed_at: string;
	user_id: string;
	track_id: string;
	artist_id: string;
	tokens_used: number;
}
