import { userState } from '$lib/global/state.svelte';
import { getTrackUrl } from '$lib/remote-functions/listening.remote';
import type { MixtapeHydrated, Release, Track } from '@soli/shared/types';

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
