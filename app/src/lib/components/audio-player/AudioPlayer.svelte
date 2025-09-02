<script lang="ts">
	import { setActiveSong, userState } from '$lib/global/state.svelte.js';
	import { makeImageLink } from '$lib/utils';
	import type { LikedTrackObject, ReleaseHydrated, TrackRaw } from '../../../../../shared/types';
	import TrackLikeButton from '../releases/TrackLikeButton.svelte';

	let {
		userId,
		userPayPerStream,
		track,
		release,
		songUrl,
		likedTracks
	}: {
		userId: string;
		userPayPerStream: number;
		track: TrackRaw;
		release: ReleaseHydrated;
		songUrl: string;
		likedTracks: LikedTrackObject[];
	} = $props();

	if ('mediaSession' in navigator) {
		navigator.mediaSession.metadata = new MediaMetadata({
			title: track.title,
			artist: release.artist_name,
			album: release.title,
			artwork: [
				{
					src: makeImageLink(release.artwork_ipfs_cid, 512),
					sizes: '512x512',
					type: 'image/png'
				}
			]
		});
	}
</script>

<div class="audio-player">
	<div>
		“{track.title}” by <a href={`/artists/${release.artist_id}`}>{release.artist_name}</a>
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
	<TrackLikeButton trackID={track.id} {likedTracks} lightOrDark={'dark'} />
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
	.like-button-wrapper {
		color: #333;
	}
</style>
