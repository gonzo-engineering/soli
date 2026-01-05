<script lang="ts">
	import { userState } from '$lib/global/state.svelte.js';
	import { logStream } from '$lib/remote-functions/listening.remote';
	import { updateUserTokensBalance } from '$lib/remote-functions/user.remote';
	import { makeImageLink } from '$lib/utils';
	import { setActiveSong } from '$lib/utils/audio-playback';
	import { STREAM_THRESHOLD_SECONDS } from '../../../../../shared/config';
	import type { Track } from '../../../../../shared/types/core';
	import type { ReleaseHydrated, TrackHydrated } from '../../../../../shared/types/hydrated';
	import ButtonWrapper from '../layout/ButtonWrapper.svelte';
	import Icon from '../layout/Icon.svelte';
	import Logo from '../layout/Logo.svelte';
	import TrackLikeButton from '../releases/TrackLikeButton.svelte';
	import { fade, slide } from 'svelte/transition';
	import SpinningRecord from './SpinningRecord.svelte';

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

	let fullPage = $state(false);
	let audioElement: HTMLAudioElement | null = $state(null);
	let charged = $state(false);
	let paymentPopupVisible = $state(false);
	let listenedSeconds = $state(0);
	let lastTime = $state(0);

	const onTimeUpdate = () => {
		if (!audioElement || charged) return;

		const delta = audioElement.currentTime - lastTime;

		if (delta > 0 && delta < 1.5) {
			listenedSeconds += delta;
		}

		lastTime = audioElement.currentTime;

		if (listenedSeconds >= STREAM_THRESHOLD_SECONDS) {
			charged = true;
			charge();
			showPaymentPopup();
		}
	};

	const showPaymentPopup = () => {
		paymentPopupVisible = true;
		setTimeout(() => {
			paymentPopupVisible = false;
		}, 3000);
	};

	const charge = async () => {
		await updateUserTokensBalance({
			userId,
			tokens: userPayPerStream,
			addOrSubtract: 'subtract'
		});

		await logStream({
			streamId: userState.activeStreamSessionId!,
			userId,
			artistId: release.artist_id,
			trackId: track.id,
			tokensUsed: userPayPerStream
		});
	};

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

	$effect(() => {
		if (!songUrl || !track?.id || !audioElement) return;

		listenedSeconds = 0;
		lastTime = 0;
		charged = false;

		audioElement.removeEventListener('timeupdate', onTimeUpdate);
		audioElement.addEventListener('timeupdate', onTimeUpdate);

		return () => {
			audioElement?.removeEventListener('timeupdate', onTimeUpdate);
		};
	});
</script>

<div
	class="audio-player"
	class:full-page={fullPage}
	transition:slide={{ duration: 300, axis: 'y' }}
>
	{#if fullPage}
		<Logo />
		<h3>Now playing...</h3>
		<SpinningRecord
			artworkUrl={makeImageLink(release.artwork_ipfs_cid, 512)}
			isPaused={userState.activeSongIsPaused}
		/>
	{/if}
	<div class="mobile-wrapper" class:reverse-column={fullPage}>
		<div class="hidden-on-desktop">
			<ButtonWrapper
				onClickFunction={() => {
					fullPage = !fullPage;
				}}
			>
				<div style:transform={fullPage ? 'rotate(0deg)' : 'rotate(180deg)'}>
					<Icon key="chevron" size={28} />
				</div>
			</ButtonWrapper>
		</div>
		<div class="essentials">
			<div class="now-playing-info">
				<div>
					“{track.title}” by
					<a href={`/artists/${release.artist_id}`} onclick={() => (fullPage = false)}
						>{release.artist.name}</a
					>
				</div>
				<TrackLikeButton trackID={track.id} {likedTracks} />
			</div>
			<audio
				bind:this={audioElement}
				src={songUrl}
				bind:paused={userState.activeSongIsPaused}
				ontimeupdate={onTimeUpdate}
				onended={() => {
					if (userState.autoPlay) {
						const siblingTracks = userState.activeMixtape?.tracks || release.tracks;
						const currentSongIndex = siblingTracks.findIndex(
							(track) => track.ipfs_cid === userState.activeSong?.ipfs_cid
						);
						if (currentSongIndex !== -1 && currentSongIndex < siblingTracks.length - 1) {
							const nextSong = siblingTracks[currentSongIndex + 1];
							const nextSongRelease = userState.activeMixtape
								? userState.activeMixtape!.tracks.find(
										(track) => track.ipfs_cid === nextSong.ipfs_cid
									)!.release
								: release;
							setActiveSong(
								nextSong,
								nextSongRelease,
								userBalance,
								userPayPerStream,
								userState.activeMixtape ? userState.activeMixtape : undefined
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
	</div>
</div>

{#if paymentPopupVisible}
	<div class="payment-popup" transition:fade>
		{userPayPerStream} token{userPayPerStream !== 1 ? 's' : ''} sent to {release.artist.name}
	</div>
{/if}

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
		color: var(--color-text);
		background-color: var(--color-background-secondary);
		padding: 0 1rem 1rem 1rem;
		box-shadow: var(--box-shadow);
	}
	h3 {
		margin: 0;
	}
	.full-page {
		top: 0;
		height: 100vh;
		z-index: 1000;
	}
	.now-playing-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}
	.mobile-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}
	.reverse-column {
		flex-direction: column-reverse;
	}
	.essentials {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}
	.payment-popup {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: var(--color-background-secondary);
		color: var(--color-text);
		padding: 0.5rem 1rem;
		border-radius: 12px;
		box-shadow: var(--box-shadow);
		font-size: 1rem;
		min-width: fit-content;
		text-align: center;
		font-weight: bold;
		white-space: nowrap;
		z-index: 2000;
	}
	@media (min-width: 600px) {
		.audio-player {
			padding: 1rem;
		}
		.essentials {
			display: flex;
			flex-direction: row;
			text-align: center;
			justify-content: space-evenly;
			gap: 2rem;
		}
		.hidden-on-desktop {
			display: none;
		}
	}
</style>
