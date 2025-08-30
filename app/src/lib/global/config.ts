export const DOMAIN = 'https://soli.network';

export const REVENUE_SPLIT = {
	artists: 0.9,
	platform: 0.1
};

export const PUBLIC_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const TABLES = {
	users: 'users',
	artists: 'artists',
	artistMembers: 'artist_members',
	releasesHydrated: 'hydrated_releases',
	streams: 'streams',
	betaUsers: 'beta-users',
	likedTracks: 'liked_tracks',
	followedArtists: 'followed_artists'
};

export const PUBLIC_PATH_ROOTS = [
	'/login',
	'/auth',
	'/about',
	'/contact',
	'/privacy',
	'/terms',
	'/api/checkout'
];
