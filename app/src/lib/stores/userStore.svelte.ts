import type { ArtistManifest, Track } from '$lib/types';

export const user: {
	activeSong: Track | null;
	activeSongArtist: ArtistManifest | null;
	// Hard coded settings for now
	balance: number; // 0p minimum
	settings: {
		payPerStream: number; // 1p minimum, default 3p
		autoPlaySongsInReleases: boolean; // default false
	};
} = $state({
	activeSong: null,
	activeSongArtist: null,
	balance: 1000,
	settings: {
		payPerStream: 3,
		autoPlaySongsInReleases: true
	}
});

const payouts = $state<Record<string, number>>({});

export const setActiveSong = (song: Track, artist: ArtistManifest) => {
	if (user.balance < user.settings.payPerStream) {
		throw new Error('Not enough balance to play this song');
	}
	user.activeSong = song;
	user.activeSongArtist = artist;
	// TODO: Improve this to use a more accurate timer
	// Deduct the pay per stream after 30 of playtime
	setTimeout(() => {
		user.balance -= user.settings.payPerStream;
		if (payouts[artist.artist.id] === undefined) {
			payouts[artist.artist.id] = 0;
		}
		payouts[artist.artist.id] += user.settings.payPerStream;
		console.log('Session payouts:', JSON.stringify(payouts));
	}, 30000);
};

// Potential user settings
//
// - Amount to pay per stream (minimum 1p, default 3p)
// - Auto-play next song in releases/playlists
