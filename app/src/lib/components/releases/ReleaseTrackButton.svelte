<script lang="ts">
	import { setActiveSong, userState } from '$lib/global/state.svelte';
	import type { ReleaseHydrated, TrackRaw } from '../../../../../shared/types';
	import Pause from '../icons/Pause.svelte';
	import Play from '../icons/Play.svelte';
	import ButtonWrapper from '../layout/ButtonWrapper.svelte';

	let {
		track,
		release
	}: {
		track: TrackRaw;
		release: ReleaseHydrated;
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
