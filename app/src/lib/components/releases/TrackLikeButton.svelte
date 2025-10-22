<script lang="ts">
	import type { LikedTrackObject } from '../../../../../shared/types';
	import Heart from '../icons/Heart.svelte';
	import { toggleLikedTrack } from '$lib/remote-functions/tracks.remote';

	let {
		trackID,
		likedTracks,
		lightOrDark
	}: {
		trackID: string;
		likedTracks: LikedTrackObject[];
		lightOrDark: 'light' | 'dark';
	} = $props();

	// Prevents duplicate form IDs for kindred TrackLikeButton components on the same page
	const trackRandomKey = Math.random().toString(36).substring(2, 15);
</script>

<form {...toggleLikedTrack.for(trackRandomKey)}>
	<input {...toggleLikedTrack.fields.trackId.as('hidden')} value={trackID} />
	<input
		{...toggleLikedTrack.fields.addOrRemove.as('hidden')}
		value={likedTracks.some((t) => t.track.id === trackID) ? 'remove' : 'add'}
	/>
	<button type="submit" class={lightOrDark}>
		{#if likedTracks.some((t) => t.track.id === trackID)}
			<Heart filled />
		{:else}
			<Heart />
		{/if}
	</button>
</form>

<style>
	form {
		text-align: right;
	}
	form {
		display: flex;
	}
	button {
		background: none;
		border: none;
		cursor: pointer;
		display: flex;
	}
	.light {
		color: var(--color-text);
	}
	.dark {
		color: #333;
	}
</style>
