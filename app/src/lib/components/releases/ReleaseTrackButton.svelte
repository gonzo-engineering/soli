<script lang="ts">
	import { setActiveSong } from '$lib/utils/audio-playback';
	import { userState } from '$lib/global/state.svelte';
	import type { Release, Track, Listener } from '../../../../../shared/types/core';
	import ButtonWrapper from '../layout/ButtonWrapper.svelte';
	import Icon from '../layout/Icon.svelte';

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
				setActiveSong(track, release, userProfile.tokens_balance, userProfile.pay_per_stream);
				userState.autoPlay = false;
			}
		}}
	>
		{#if track.ipfs_cid === userState.activeSong?.ipfs_cid && !userState.activeSongIsPaused}
			<Icon key="pause" size={26} />
		{:else}
			<Icon key="play" size={26} />
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
