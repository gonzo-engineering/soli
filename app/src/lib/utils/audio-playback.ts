import { userState } from '$lib/global/state.svelte';
import { getTrackUrl } from '$lib/remote-functions/listening.remote';
import type { Release, Track } from '../../../../shared/types/core';
import type { MixtapeHydrated } from '../../../../shared/types/hydrated';

export const setActiveSong = async (
	song: Track,
	release: Release,
	userBalance: number,
	userPayPerStream: number,
	mixtape?: MixtapeHydrated
) => {
	if (userBalance < userPayPerStream) {
		throw new Error('Not enough balance');
	}

	const songUrl = await getTrackUrl(song.id);

	userState.activeSong = song;
	userState.activeSongRelease = release;
	userState.activeSongUrl = songUrl;
	userState.activeMixtape = mixtape || null;
	userState.activeStreamSessionId = crypto.randomUUID();
};
