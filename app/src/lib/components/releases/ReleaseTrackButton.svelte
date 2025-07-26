<script lang="ts">
	import { setActiveSong, userState } from '$lib/global/state.svelte';
	import type { ReleaseHydrated, UserProfile, TrackRaw } from '../../../../../shared/types';
	import type { Session } from '@supabase/supabase-js';
	import Pause from '../icons/Pause.svelte';
	import Play from '../icons/Play.svelte';
	import ButtonWrapper from '../layout/ButtonWrapper.svelte';

	let {
		track,
		release,
		profileData,
		session
	}: {
		track: TrackRaw;
		release: ReleaseHydrated;
		profileData: UserProfile;
		session: Session;
	} = $props();
</script>

{#if userState.liveBalance}
	<ButtonWrapper
		onClickFunction={() => {
			if (track.ipfs_cid == userState.activeSong?.ipfs_cid) {
				userState.activeSongIsPaused = !userState.activeSongIsPaused;
			} else {
				setActiveSong(
					track,
					release,
					session.user.id,
					userState.liveBalance ?? profileData.tokens_balance,
					profileData.pay_per_stream
				);
				userState.autoPlay = false;
			}
		}}
	>
		{#if track.ipfs_cid === userState.activeSong?.ipfs_cid && !userState.activeSongIsPaused}
			<div class="play-button"><Pause /></div>
		{:else}
			<div class="play-button"><Play /></div>
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
	.play-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 10%;
		border-radius: 50%;
		background-color: var(--color-accent);
		color: var(--color-background);
	}
</style>
