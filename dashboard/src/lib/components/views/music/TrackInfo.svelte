<script lang="ts">
	import ThreeDotsIcon from '$lib/components/icons/ThreeDotsIcon.svelte';
	import PopupWrapper from '$lib/components/layout/PopupWrapper.svelte';
	import { deleteTrack } from '$lib/remote-functions/music.remote';
	import type { Track } from '@soli/shared/types';
	import { prettifyDuration } from '@soli/shared/utils';
	import BinIcon from '../../icons/BinIcon.svelte';
	import ButtonWrapper from '../../layout/ButtonWrapper.svelte';

	const { song }: { song: Track } = $props();

	let popupMenuOpen = $state(false);
</script>

<div class="song-wrapper">
	<div class="song-details-wrapper">
		<div>{song.title}</div>
		<div>
			<small>{prettifyDuration(song.duration_seconds)}</small>
		</div>
	</div>
	<ButtonWrapper label="Options" onClickFunction={() => (popupMenuOpen = !popupMenuOpen)}>
		<ThreeDotsIcon />
	</ButtonWrapper>
</div>

{#if popupMenuOpen}
	<PopupWrapper bind:popupMenuOpen>
		<div>{song.title}</div>
		<ButtonWrapper
			label="Delete track"
			onClickFunction={() => {
				deleteTrack(song.id);
				popupMenuOpen = false;
			}}
		>
			<div class="delete">Delete track <BinIcon /></div>
		</ButtonWrapper>
	</PopupWrapper>
{/if}

<style>
	.song-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.song-details-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
	small {
		font-weight: 500;
		font-size: 70%;
	}
	.delete {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
