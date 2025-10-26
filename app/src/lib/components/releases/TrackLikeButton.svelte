<script lang="ts">
	import Heart from '../icons/Heart.svelte';
	import { toggleLikedTrack } from '$lib/remote-functions/user.remote';
	import type { TrackHydrated } from '../../../../../shared/types/hydrated';

	let {
		trackID,
		likedTracks,
		lightOrDark
	}: {
		trackID: string;
		likedTracks: TrackHydrated[];
		lightOrDark: 'light' | 'dark';
	} = $props();

	// Prevents duplicate form IDs for kindred TrackLikeButton components on the same page
	const trackRandomKey = Math.random().toString(36).substring(2, 15);
	const isLiked = $derived(likedTracks.some((t) => t.id === trackID));
</script>

<form {...toggleLikedTrack.for(trackRandomKey)}>
	<input {...toggleLikedTrack.fields.trackId.as('hidden', trackID)} />
	<input {...toggleLikedTrack.fields.addOrRemove.as('hidden', isLiked ? 'remove' : 'add')} />
	<button type="submit" class={lightOrDark}>
		<Heart filled={isLiked} />
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
