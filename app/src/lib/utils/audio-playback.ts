import { userState } from '$lib/global/state.svelte';
import { getTrackUrl } from '$lib/remote-functions/listening.remote';
import type { Release, Track } from '../../../../shared/types/core';

export const setActiveSong = async (
	song: Track,
	release: Release,
	userBalance: number,
	userPayPerStream: number
) => {
	if (userBalance < userPayPerStream) {
		throw new Error('Not enough balance');
	}

	const songUrl = await getTrackUrl(song.ipfs_cid);

	userState.activeSong = song;
	userState.activeSongRelease = release;
	userState.activeSongUrl = songUrl;
	// TODO: Create session ID for logging streams
};
