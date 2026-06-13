<script lang="ts">
	import { toggleLikedTrack } from '$lib/remote-functions/user.remote';
	import type { TrackHydrated } from '@soli/shared/types/hydrated';
	import Icon from '../layout/Icon.svelte';

	let {
		trackID,
		likedTracks
	}: {
		trackID: string;
		likedTracks: TrackHydrated[];
	} = $props();

	// Prevents duplicate form IDs for kindred TrackLikeButton components on the same page
	const trackRandomKey = Math.random().toString(36).substring(2, 15);
	const isLiked = $derived(likedTracks.some((t) => t.id === trackID));
</script>

<form {...toggleLikedTrack.for(trackRandomKey)}>
	<input {...toggleLikedTrack.fields.trackId.as('hidden', trackID)} />
	<input {...toggleLikedTrack.fields.addOrRemove.as('hidden', isLiked ? 'remove' : 'add')} />
	<button type="submit">
		<Icon key="heart" strokeMode={!isLiked} />
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
		color: var(--color-accent);
	}
	button:hover {
		opacity: 0.8;
	}
</style>
