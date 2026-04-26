<script lang="ts">
	import { userState } from '$lib/global/state.svelte';
	import { getHydratedRelease } from '$lib/remote-functions/releases.remote';
	import type { Listener } from '../../../../../shared/types/core';
	import type { TrackHydrated } from '../../../../../shared/types/hydrated';
	import AudioPlayer from '../audio-player/AudioPlayer.svelte';
	import ButtonWrapper from './ButtonWrapper.svelte';
	import Icon from './Icon.svelte';
	import { page } from '$app/state';

	let {
		searchIsOpen = $bindable(),
		userId,
		userProfileData,
		userLikedTracks
	}: {
		searchIsOpen: boolean;
		userId: string;
		userProfileData: Listener;
		userLikedTracks: TrackHydrated[];
	} = $props();

	let currentReleaseHydrated = $derived(
		userState.activeSongRelease?.id
			? await getHydratedRelease(userState.activeSongRelease?.id)
			: null
	);

	let currentPage = $state(page);
	let currentPath = $derived(currentPage.url.pathname);

	$effect(() => {
		console.log('Current page:', currentPath);
	});
</script>

<nav>
	{#if userState.activeSong && userState.activeSongRelease && userProfileData.tokens_balance && userState.activeSongUrl && userId && userProfileData.pay_per_stream && currentReleaseHydrated}
		<AudioPlayer
			{userId}
			userBalance={userProfileData.tokens_balance}
			userPayPerStream={userProfileData.pay_per_stream}
			track={userState.activeSong}
			release={currentReleaseHydrated}
			songUrl={userState.activeSongUrl}
			likedTracks={userLikedTracks}
		/>
	{/if}
	<div class="sticky-nav-buttons">
		<div
			class="button"
			style="background-color: {searchIsOpen ? 'var(--color-text)' : 'transparent'}"
		>
			<ButtonWrapper
				onClickFunction={() => {
					const searchState = searchIsOpen;
					searchIsOpen = !searchState;
				}}
				label="Search"
			>
				<Icon
					key="search"
					size={32}
					color={searchIsOpen ? 'var(--color-background)' : 'var(--color-text)'}
					strokeMode
				/>
			</ButtonWrapper>
		</div>
		<div
			class="button"
			style="background-color: {currentPath.startsWith('/me/collections')
				? 'var(--color-text)'
				: 'transparent'}"
		>
			<a href="/me/collections"
				><Icon
					key="vinyl"
					size={32}
					color={currentPath.startsWith('/me/collections')
						? 'var(--color-background)'
						: 'var(--color-text)'}
				/></a
			>
		</div>
		<div
			class="button"
			style="background-color: {currentPath.startsWith('/me/mixtapes')
				? 'var(--color-text)'
				: 'transparent'}"
		>
			<a href="/me/mixtapes"
				><Icon
					key="cassette"
					size={32}
					color={currentPath.startsWith('/me/mixtapes')
						? 'var(--color-background)'
						: 'var(--color-text)'}
				/></a
			>
		</div>
	</div>
</nav>

<style>
	nav {
		position: sticky;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: var(--color-background-secondary);
		z-index: 1000;
		box-shadow: var(--box-shadow);
	}
	.sticky-nav-buttons {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 1rem;
	}
	a {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.button {
		padding: 0.5rem;
		border-radius: 40px;
	}
</style>
