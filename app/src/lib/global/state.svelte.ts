import { getTrackUrl, logStream } from '$lib/remote-functions/listening.remote';
import { updateUserTokensBalance } from '$lib/remote-functions/user.remote';
import type { Mixtape, Release, Track } from '../../../../shared/types/core';
import type { TrackHydrated } from '../../../../shared/types/hydrated';

interface UserState {
	id: string;
	activeSong: Track | null;
	activeSongRelease: Release | null;
	activeSongUrl: string | null;
	activeSongIsPaused: boolean;
	autoPlay: boolean;
	liveBalance: number;
	payPerStream: number;
	music: {
		likedTracks: TrackHydrated[];
		mixtapes: Mixtape[];
	};
}

export const userState: UserState = $state({
	// TODO: Make this less dumb
	id: '',
	activeSong: null,
	activeSongRelease: null,
	activeSongUrl: null,
	activeSongIsPaused: false,
	autoPlay: false,
	liveBalance: 0,
	payPerStream: 3,
	music: {
		likedTracks: [],
		mixtapes: []
	}
});

export const setActiveSong = async (
	song: Track,
	release: Release,
	userId: string,
	userBalance: number,
	userPayPerStream: number
) => {
	if (userBalance < userPayPerStream) {
		throw new Error('Not enough balance to play this song');
	}

	const songUrl = await getTrackUrl(song.ipfs_cid);

	userState.activeSong = song;
	userState.activeSongRelease = release;
	userState.activeSongUrl = songUrl;

	// TODO: Improve this to use a more accurate timer
	// Deduct the pay per stream after 30 seconds of playtime
	setTimeout(() => {
		updateUserTokensBalance({ userId, tokens: userPayPerStream, addOrSubtract: 'subtract' });
		userState.liveBalance -= userPayPerStream;
		logStream({
			userId,
			artistId: release.artist_id,
			trackId: song.id,
			tokensUsed: userPayPerStream
		});
	}, 30000);
};
