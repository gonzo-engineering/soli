<script lang="ts">
	import { userState } from '$lib/global/state.svelte';
	import { getHydratedRelease } from '$lib/remote-functions/releases.remote';
	import type { Listener } from '../../../../../shared/types/core';
	import type { TrackHydrated } from '../../../../../shared/types/hydrated';
	import AudioPlayer from '../audio-player/AudioPlayer.svelte';
	import ButtonWrapper from './ButtonWrapper.svelte';
	import Icon, { type IconKey } from './Icon.svelte';
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

	const isActive = (path: string) => page.url.pathname.startsWith(path);

	const navLinks: { sectionRoot: string; icon: IconKey; label: string }[] = [
		{ sectionRoot: '/me/collections', icon: 'vinyl', label: 'Collections' },
		{ sectionRoot: '/me/mixtapes', icon: 'cassette', label: 'Mixtapes' }
	];
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
		<div class="button" class:active={searchIsOpen}>
			<ButtonWrapper onClickFunction={() => (searchIsOpen = !searchIsOpen)} label="Search">
				<Icon
					key="search"
					size={32}
					color={searchIsOpen ? 'var(--color-background)' : 'var(--color-text)'}
					strokeMode
				/>
			</ButtonWrapper>
		</div>
		{#each navLinks as { sectionRoot: href, icon, label }}
			<div class="button" class:active={isActive(href)}>
				<a {href} aria-label={label}>
					<Icon
						key={icon}
						size={32}
						color={isActive(href) ? 'var(--color-background)' : 'var(--color-text)'}
					/>
				</a>
			</div>
		{/each}
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
		padding: 0.25rem;
		border-radius: 4px;
	}
	.button.active {
		background-color: var(--color-text);
	}
</style>
