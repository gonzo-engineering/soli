<script lang="ts">
	import { ButtonWrapper, Icon, PopupWrapper } from '@soli/shared/components';
	import type { Track } from '@soli/shared/types';
	import { prettifyDuration } from '@soli/shared/utils';

	import { deleteTrack } from '$lib/remote-functions/music.remote';

	const { song, onTrackDeleted }: { song: Track; onTrackDeleted: () => void } = $props();

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
		<Icon key="threeDots" size={24} />
	</ButtonWrapper>
</div>

{#if popupMenuOpen}
	<PopupWrapper bind:popupMenuOpen>
		<div>{song.title}</div>
		<ButtonWrapper
			label="Delete track"
			onClickFunction={async () => {
				popupMenuOpen = false;
				await deleteTrack(song.id);
				onTrackDeleted();
			}}
		>
			<div class="delete">Delete track <Icon key="bin" size={24} /></div>
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
