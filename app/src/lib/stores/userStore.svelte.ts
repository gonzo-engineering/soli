import type { Artist, Track } from '$lib/types';

export const user: {
	activeSong: Track | null;
	activeSongArtist: Artist | null;
} = $state({
	activeSong: null,
	activeSongArtist: null
});

export const setActiveSong = (song: Track, artist: Artist) => {
	user.activeSong = song;
	user.activeSongArtist = artist;
};

// Potential user settings
//
// - Amount to pay per stream (minimum 1p, default 3p)
// - Auto-play next song in releases/playlists
