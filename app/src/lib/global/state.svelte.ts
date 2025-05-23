import type { TrackRaw, UserState } from '$lib/types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL, TABLES } from './config';

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const userState: UserState = $state({
	activeSong: null,
	activeSongUrl: null,
	activeSongArtist: null,
	activeSongIsPaused: false,
	liveBalance: 0,
	payPerStream: 3
});

const logStream = async (userId: string, artistId: string, trackId: string, tokensUsed: number) => {
	console.log(`Logging stream for '${trackId}' by user ${userId}`);
	const { error } = await supabase
		.from(TABLES.streams)
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
		.from(TABLES.users)
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

export const setActiveSong = async (
	song: TrackRaw,
	artist: {
		artistId: string;
		artistName: string;
	},
	userId: string,
	userBalance: number,
	userPayPerStream: number
) => {
	if (userBalance < userPayPerStream) {
		throw new Error('Not enough balance to play this song');
	}

	const songUrl = await fetch('/api/links/' + song.ipfs_cid).then((res) => res.text());

	userState.activeSong = song;
	userState.activeSongArtist = artist;
	userState.activeSongUrl = songUrl;

	// TODO: Improve this to use a more accurate timer
	// Deduct the pay per stream after 30 of playtime
	setTimeout(() => {
		updateUserBalance(userId, userBalance - userPayPerStream);
		logStream(userId, artist.artistId, song.id, userPayPerStream);
	}, 30000);
};
