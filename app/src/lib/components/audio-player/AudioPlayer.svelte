<script lang="ts">
	import { userState } from '$lib/global/state.svelte.js';
	import { makeImageLink } from '$lib/utils';
	import { setActiveSong } from '$lib/utils/audio-playback';
	import type { Track } from '../../../../../shared/types/core';
	import type { ReleaseHydrated, TrackHydrated } from '../../../../../shared/types/hydrated';
	import TrackLikeButton from '../releases/TrackLikeButton.svelte';

	let {
		userId,
		userBalance,
		userPayPerStream,
		track,
		release,
		songUrl,
		likedTracks
	}: {
		userId: string;
		userBalance: number;
		userPayPerStream: number;
		track: Track;
		release: ReleaseHydrated;
		songUrl: string;
		likedTracks: TrackHydrated[];
	} = $props();

	$effect(() => {
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: track.title,
				artist: release.artist.name,
				album: release.title,
				artwork: [96, 128, 192, 256, 384, 512].map((size) => ({
					src: makeImageLink(release.artwork_ipfs_cid, size),
					sizes: `${size}x${size}`,
					type: 'image/png'
				}))
			});
		}
	});
</script>

<div class="audio-player">
	<div class="now-playing-info">
		<div>
			“{track.title}” by <a href={`/artists/${release.artist_id}`}>{release.artist.name}</a>
		</div>
		<TrackLikeButton trackID={track.id} {likedTracks} lightOrDark={'dark'} />
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
					setActiveSong(nextSong, release, userId, userBalance, userPayPerStream);
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
	.now-playing-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
	}
	@media (min-width: 600px) {
		.audio-player {
			flex-direction: row;
			gap: 2rem;
		}
	}
</style>
