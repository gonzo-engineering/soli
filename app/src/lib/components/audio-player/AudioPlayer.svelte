<script lang="ts">
	import { setActiveSong, userState } from '$lib/global/state.svelte.js';
	import type { ReleaseHydrated } from '../../../../../shared/types';

	let {
		userId,
		userPayPerStream,
		title,
		release,
		songUrl
	}: {
		userId: string;
		userPayPerStream: number;
		title: string;
		release: ReleaseHydrated;
		songUrl: string;
	} = $props();
</script>

<div class="audio-player">
	<div>
		“{title}” by <a href={`/artists/${release.artist_id}`}>{release.artist_name}</a>
	</div>
	<audio
		src={songUrl}
		bind:paused={userState.activeSongIsPaused}
		onended={() => {
			if (userState.autoPlay) {
				const currentSongIndex = release.tracks.findIndex(
					(track) => track.ipfs_cid === userState.activeSong?.ipfs_cid
				);
				if (currentSongIndex !== -1 && currentSongIndex < release.tracks.length - 1) {
					const nextSong = release.tracks[currentSongIndex + 1];
					setActiveSong(
						nextSong,
						release,
						userId,
						userState.liveBalance ?? userPayPerStream,
						userPayPerStream
					);
				} else {
					userState.autoPlay = false;
				}
			}
		}}
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
