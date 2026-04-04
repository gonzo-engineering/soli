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
		userProfile: Listener | null;
	} = $props();
</script>

{#if userProfile}
	<ButtonWrapper
		label={track.ipfs_cid === userState.activeSong?.ipfs_cid && !userState.activeSongIsPaused
			? 'Pause'
			: 'Play'}
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
	<button class="play-button" onclick={() => alert('You must be logged in to listen to music.')}>
		<Icon key="play" size={26} />
	</button>
{/if}

<style>
	button {
		background: none;
		border: none;
		color: gray;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
