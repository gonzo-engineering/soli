<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { LikedTrackObject } from '../../../../../shared/types';
	import { enhance } from '$app/forms';
	import Heart from '../icons/Heart.svelte';

	let {
		trackID,
		likedTracks,
		lightOrDark
	}: {
		trackID: string;
		likedTracks: LikedTrackObject[];
		lightOrDark: 'light' | 'dark';
	} = $props();

	const handleLikedTrackChange: SubmitFunction = () => {
		return async ({ update }) => {
			update();
		};
	};
</script>

<form
	method="post"
	action="/me/liked-tracks?/toggleLikedTrack"
	use:enhance={handleLikedTrackChange}
>
	<input type="hidden" name="trackId" value={trackID} />
	<input
		type="hidden"
		name="addOrRemove"
		value={likedTracks.some((t) => t.track.id === trackID) ? 'remove' : 'add'}
	/>
	<button
		type="submit"
		name="action"
		value="toggleLikedTrack"
		aria-label="Remove from likes tracks"
		class={lightOrDark}
	>
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
