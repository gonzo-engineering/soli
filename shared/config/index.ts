export const APP_DOMAIN = 'https://soli.network';
export const APP_LOCAL_PORT = 3000;

export const DASHBOARD_DOMAIN = 'https://dashboard.soli.network';
export const DASHBOARD_LOCAL_PORT = 3001;

export const API_DOMAIN = 'https://api.soli.network';
export const API_LOCAL_PORT = 3002;

// TODO: Refactor monorepo to share this constant
export const STRIPE_API_VERSION = '2026-03-25.dahlia';

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
	labels: 'labels'
};
