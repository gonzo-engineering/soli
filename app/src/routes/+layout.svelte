<script>
	import '../../../shared/styles/reset.css';
	import '../../../shared/styles/global.css';

	import { page } from '$app/state';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userState } from '$lib/global/state.svelte.js';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import AudioPlayer from '$lib/components/audio-player/AudioPlayer.svelte';
	import { getHydratedRelease } from '$lib/remote-functions/releases.remote';
	import Navigation from '$lib/components/layout/Navigation.svelte';
	import { INDEXABLE_PATH_ROOTS } from '$lib/global/config';

	let { children, data } = $props();

	let { supabase, session } = $derived(data);
	let pagePath = $derived(page.url.pathname);

	let hydratedReleasePromise = $derived(
		userState.activeSongRelease?.id ? getHydratedRelease(userState.activeSongRelease?.id) : null
	);
	let hydratedRelease = $derived(await hydratedReleasePromise);

	let menuIsOpen = $state(false);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<meta name="theme-color" content="#222222" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#f0f0f0" media="(prefers-color-scheme: light)" />
	{#key pagePath}
		{#if INDEXABLE_PATH_ROOTS.some((path) => pagePath.startsWith(path)) || pagePath === '/'}
			<script
				data-goatcounter="https://soli.goatcounter.com/count"
				async
				src="//gc.zgo.at/count.js"
			></script>
		{:else}
			<meta name="robots" content="noindex" />
		{/if}
	{/key}
</svelte:head>

{#if menuIsOpen}
	<div class="menu">
		<Header bind:menuIsOpen userIsLoggedIn={session ? true : false} />
		<Navigation bind:menuIsOpen {session} />
	</div>
{:else}
	<Header bind:menuIsOpen userIsLoggedIn={session ? true : false} />
{/if}

<main>
	{@render children()}
</main>

<Footer />

{#if userState.activeSong && userState.activeSongRelease && data.profileData.tokens_balance && userState.activeSongUrl && data.session?.user.id && data.profileData?.pay_per_stream && hydratedRelease}
	<AudioPlayer
		userId={data.session?.user.id}
		userBalance={data.profileData.tokens_balance}
		userPayPerStream={data.profileData?.pay_per_stream}
		track={userState.activeSong}
		release={hydratedRelease}
		songUrl={userState.activeSongUrl}
		likedTracks={data.likedTracks}
	/>
{/if}

<style>
	main {
		margin: 2rem 1rem;
	}
	.menu {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: var(--color-background);
		z-index: 1000;
	}
</style>
