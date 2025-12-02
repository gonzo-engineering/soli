<script lang="ts">
	import { setActiveSong } from '$lib/utils/audio-playback';
	import { userState } from '$lib/global/state.svelte';
	import type { Release, Track } from '../../../../../shared/types/core';
	import Pause from '../icons/Pause.svelte';
	import Play from '../icons/Play.svelte';
	import ButtonWrapper from '../layout/ButtonWrapper.svelte';

	let {
		track,
		release
	}: {
		track: Track;
		release: Release;
	} = $props();
</script>

{#if userState.liveBalance}
	<ButtonWrapper
		onClickFunction={() => {
			if (track.ipfs_cid == userState.activeSong?.ipfs_cid) {
				userState.activeSongIsPaused = !userState.activeSongIsPaused;
			} else {
				setActiveSong(track, release, userState.id, userState.liveBalance, userState.payPerStream);
				userState.autoPlay = false;
			}
		}}
	>
		{#if track.ipfs_cid === userState.activeSong?.ipfs_cid && !userState.activeSongIsPaused}
			<Pause />
		{:else}
			<Play />
		{/if}
	</ButtonWrapper>
{:else}
	<button class="play-button" disabled>
		<span>Play</span>
	</button>
{/if}

<style>
	button:hover {
		cursor: pointer;
	}
</style>
