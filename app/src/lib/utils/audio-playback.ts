import { userState } from '$lib/global/state.svelte';
import { getTrackUrl, logStream } from '$lib/remote-functions/listening.remote';
import { updateUserTokensBalance } from '$lib/remote-functions/user.remote';
import type { Release, Track } from '../../../../shared/types/core';

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
		logStream({
			userId,
			artistId: release.artist_id,
			trackId: song.id,
			tokensUsed: userPayPerStream
		});
	}, 30000);
};
