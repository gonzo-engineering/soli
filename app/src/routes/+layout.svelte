<script>
	import '../../../shared/styles/reset.css';
	import '../../../shared/styles/global.css';

	import { page } from '$app/state';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import BurgerMenu from '$lib/components/layout/BurgerMenu.svelte';
	import { INDEXABLE_PATH_ROOTS } from '$lib/global/config';
	import SearchMenu from '$lib/components/search/SearchMenu.svelte';
	import StickyNav from '$lib/components/layout/StickyNav.svelte';

	let { children, data } = $props();

	let { supabase, session } = $derived(data);
	let userIsLoggedIn = $derived(session ? true : false);
	let pagePath = $derived(page.url.pathname);

	let menuIsOpen = $state(false);
	let searchIsOpen = $state(false);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});

	// Reset search when page changes
	$effect(() => {
		if (page.url) {
			searchIsOpen = false;
		}
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

{#if menuIsOpen || searchIsOpen}
	<div class="menu">
		<Header bind:menuIsOpen {userIsLoggedIn} />
		{#if menuIsOpen}
			<BurgerMenu bind:menuIsOpen {session} />
		{:else if searchIsOpen}
			<SearchMenu bind:searchIsOpen />
		{/if}
	</div>
{:else}
	<Header bind:menuIsOpen {userIsLoggedIn} />
{/if}
<main>
	{@render children()}
</main>
<Footer />

{#if data.session?.user.id && data.profileData && data.likedTracks}
	<StickyNav
		bind:searchIsOpen
		userId={data.session?.user.id}
		userProfileData={data.profileData}
		userLikedTracks={data.likedTracks}
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
