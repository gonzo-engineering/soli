<script lang="ts">
	import type { Release, Track, Listener } from '@soli/shared/types';
	import { ButtonWrapper, Icon } from '@soli/shared/components';

	import { setActiveSong } from '$lib/utils/audio-playback';
	import { userState } from '$lib/global/state.svelte';

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
		label={track.id === userState.activeSong?.id && !userState.activeSongIsPaused
			? 'Pause'
			: 'Play'}
		onClickFunction={() => {
			if (track.id == userState.activeSong?.id) {
				userState.activeSongIsPaused = !userState.activeSongIsPaused;
			} else {
				setActiveSong(track, release, userProfile.tokens_balance, userProfile.pay_per_stream);
				userState.autoPlay = false;
			}
		}}
	>
		{#if track.id === userState.activeSong?.id && !userState.activeSongIsPaused}
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
