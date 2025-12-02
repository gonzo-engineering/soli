<script lang="ts">
	import { setActiveSong } from '$lib/utils/audio-playback';
	import { userState } from '$lib/global/state.svelte';
	import type { Release, Track, Listener } from '../../../../../shared/types/core';
	import Pause from '../icons/Pause.svelte';
	import Play from '../icons/Play.svelte';
	import ButtonWrapper from '../layout/ButtonWrapper.svelte';

	let {
		track,
		release,
		userProfile
	}: {
		track: Track;
		release: Release;
		userProfile: Listener;
	} = $props();
</script>

{#if userProfile.tokens_balance && userProfile.id}
	<ButtonWrapper
		onClickFunction={() => {
			if (track.ipfs_cid == userState.activeSong?.ipfs_cid) {
				userState.activeSongIsPaused = !userState.activeSongIsPaused;
			} else {
				setActiveSong(
					track,
					release,
					userProfile.id,
					userProfile.tokens_balance,
					userProfile.pay_per_stream
				);
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
