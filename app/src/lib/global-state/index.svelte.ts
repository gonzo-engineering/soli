import type { ArtistManifest, Track, UserState } from '$lib/types';
import { createClient } from '@supabase/supabase-js';

const PUBLIC_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const userState: UserState = $state({
	activeSong: null,
	activeSongArtist: null,
	liveBalance: 0,
	payPerStream: 3
});

const logStream = async (userId: string, artistId: string, trackId: string, tokensUsed: number) => {
	console.log(`Logging stream for '${trackId}' by user ${userId}`);
	const { error } = await supabase
		.from('streams')
		.insert({
			user_id: userId,
			artist_id: artistId,
			track_id: trackId,
			tokens_used: tokensUsed
		})
		.select();
	if (error) {
		console.error('Error logging stream:', error);
	} else {
		console.log('Stream logged successfully');
	}
};

const updateUserBalance = async (userId: string, newBalance: number) => {
	console.log('Updating balance for user:', userId, 'New balance:', newBalance);
	const { error } = await supabase
		.from('profiles')
		.update({ tokens_balance: newBalance })
		.eq('id', userId)
		.select();
	if (error) {
		console.error('Error updating balance:', error);
	} else {
		console.log('Balance updated successfully');
		userState.liveBalance = newBalance;
	}
};

export const setActiveSong = (
	song: Track,
	artist: ArtistManifest,
	userId: string,
	userBalance: number,
	userPayPerStream: number
) => {
	if (userBalance < userPayPerStream) {
		throw new Error('Not enough balance to play this song');
	}
	userState.activeSong = song;
	userState.activeSongArtist = artist;
	// TODO: Improve this to use a more accurate timer
	// Deduct the pay per stream after 30 of playtime
	setTimeout(() => {
		updateUserBalance(userId, userBalance - userPayPerStream);
		logStream(userId, artist.artist.id, song.name, userPayPerStream);
	}, 30000);
};
