export const APP_DOMAIN = 'https://soli.network';
export const APP_LOCAL_PORT = 3000;

export const DASHBOARD_DOMAIN = 'https://dashboard.soli.network';
export const DASHBOARD_LOCAL_PORT = 3001;

export const API_DOMAIN = 'https://api.soli.network';
export const API_LOCAL_PORT = 3002;

export const STRIPE_API_VERSION = '2026-05-27.dahlia';

export const PLATFORM_FEE_PERCENTAGE = 0.1;
export const STREAM_THRESHOLD_SECONDS = 30;

export const TABLES = {
	users: 'users',
	artists: 'artists',
	artistsRich: 'artists_rich',
	artistMembers: 'artist_members',
	tracks: 'tracks',
	tracksRich: 'tracks_hydrated',
	releaseTracks: 'release_tracks',
	releases: 'releases',
	releasesRich: 'releases_rich',
	streams: 'streams',
	earningsLedger: 'earnings_ledger',
	payouts: 'payouts',
	betaUsers: 'beta-users',
	likedTracks: 'liked_tracks',
	followedArtists: 'followed_artists',
	collections: 'collections',
	collectionReleases: 'collection_releases',
	collectionsRich: 'collections_rich',
	mixtapes: 'mixtapes',
	mixtapesRich: 'mixtapes_rich',
	mixtapeTracks: 'mixtape_tracks',
	labels: 'labels',
	labelsRich: 'labels_rich',
	labelMembers: 'label_members'
};

export const cookieOptions = {
	name: `sb-soli.network-auth-token`,
	domain: 'soli.network',
	path: '/',
	maxAge: 60 * 60 * 24 * 365, // 1 year
	sameSite: 'lax' as const
};
