<script lang="ts">
	import { userState } from '$lib/global/state.svelte.js';

	let {
		title,
		artistName,
		artistId,
		songUrl
	}: {
		title: string;
		artistName: string;
		artistId: string;
		songUrl: string;
	} = $props();
</script>

<div class="audio-player">
	<div>
		{title} by <a href={`/artists/${artistId}`}>{artistName}</a>
	</div>
	<audio
		src={songUrl}
		bind:paused={userState.activeSongIsPaused}
		controls
		autoplay
		controlsList="nodownload noplaybackrate"
	></audio>
</div>

<style>
	.audio-player {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
		text-align: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		color: #333;
		background-color: #f0f0f0;
		padding: 1rem;
	}
	a {
		color: black;
	}
	@media (min-width: 600px) {
		.audio-player {
			flex-direction: row;
			gap: 2rem;
		}
	}
</style>
