<script>
	import '../../../shared/styles/reset.css';
	import '../../../shared/styles/global.css';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userState } from '$lib/global/state.svelte.js';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import AudioPlayer from '$lib/components/audio-player/AudioPlayer.svelte';

	let { children, data } = $props();

	let { supabase, session } = $derived(data);

	let menuIsOpen = $state(false);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});

	const menuLinks = [
		{ href: '/account', label: 'Account' },
		{ href: '/likes', label: 'Liked tracks' },
		{ href: '/releases', label: 'Releases' },
		{ href: '/artists', label: 'Artists' },
		{ href: '/about', label: 'About' }
	];
</script>

<svelte:head>
	<meta name="theme-color" content="#1e1e1e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#f0f0f0" media="(prefers-color-scheme: light)" />
</svelte:head>

{#if menuIsOpen}
	<div class="menu">
		<Header bind:menuIsOpen userIsLoggedIn={session ? true : false} />
		<nav>
			<ul>
				{#if session}
					{#each menuLinks as link}
						<li><a href={link.href} onclick={() => (menuIsOpen = !menuIsOpen)}>{link.label}</a></li>
					{/each}
				{:else}
					<li><a href="/login" onclick={() => (menuIsOpen = !menuIsOpen)}>Login</a></li>
				{/if}
			</ul>
		</nav>
	</div>
{:else}
	<Header bind:menuIsOpen userIsLoggedIn={session ? true : false} />
{/if}

<main>
	{@render children()}
</main>

<Footer />

{#if userState.activeSong && userState.activeSongRelease && userState.liveBalance && userState.activeSongUrl && data.session?.user.id && data.profileData?.pay_per_stream}
	<AudioPlayer
		userId={data.session?.user.id}
		userPayPerStream={data.profileData?.pay_per_stream}
		track={userState.activeSong}
		release={userState.activeSongRelease}
		songUrl={userState.activeSongUrl}
		likedTracks={data.likedTracks}
	/>
{/if}

<style>
	main {
		margin: 0 1rem;
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
	ul {
		list-style: none;
		padding: 1rem;
		margin: 0;
	}
	li {
		margin: 0.5rem 0;
	}
	a {
		text-decoration: none;
		color: var(--color-text);
		font-size: 1.4rem;
	}
</style>
