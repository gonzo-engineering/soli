<script>
	import '../../../shared/styles/reset.css';
	import '../../../shared/styles/global.css';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userState } from '$lib/global/state.svelte.js';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import AudioPlayer from '$lib/components/audio-player/AudioPlayer.svelte';
	import Vinyl from '$lib/components/icons/Vinyl.svelte';
	import Cassette from '$lib/components/icons/Cassette.svelte';
	import Heart from '$lib/components/icons/Heart.svelte';

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
		{
			section: 'Browse',
			links: [
				{ href: '/releases', label: 'Releases' },
				{ href: '/artists', label: 'Artists' },
				{ href: '/genres', label: 'Genres' }
			]
		},
		{
			section: 'Your Library',
			links: [
				{ href: '/listener/collections', label: 'Collections' },
				{ href: '/listener/mixtapes', label: 'Mixtapes' },
				{ href: '/listener/liked-tracks', label: 'Liked tracks' }
			]
		},
		{
			section: 'Misc',
			links: [
				{ href: '/account', label: 'Account' },
				{ href: '/about', label: 'About' }
			]
		}
	];
</script>

<svelte:head>
	<meta name="theme-color" content="#1e1e1e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#f0f0f0" media="(prefers-color-scheme: light)" />
	<script
		data-goatcounter="https://soli.goatcounter.com/count"
		async
		src="//gc.zgo.at/count.js"
	></script>
</svelte:head>

{#if menuIsOpen}
	<div class="menu">
		<Header bind:menuIsOpen userIsLoggedIn={session ? true : false} />
		<nav>
			<ul>
				{#if session}
					{#each menuLinks as section}
						<div class="nav-section">
							<span class="section-title">{section.section}</span>
							{#each section.links as link}
								<li>
									<a href={link.href} onclick={() => (menuIsOpen = !menuIsOpen)}>
										{link.label}
										{#if link.label === 'Collections'}
											<span class="icon"><Vinyl /></span>
										{:else if link.label === 'Mixtapes'}
											<span class="icon"><Cassette /></span>
										{:else if link.label === 'Liked tracks'}
											<span class="icon"><Heart filled /></span>
										{/if}
									</a>
								</li>
							{/each}
						</div>
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
	.nav-section {
		margin-bottom: 2rem;
	}
	.section-title {
		font-weight: 600;
		text-transform: uppercase;
		margin: 1rem 0 0.5rem 0;
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
		margin-right: 0.5rem;
	}
	.icon {
		margin-left: 0.3rem;
	}
</style>
