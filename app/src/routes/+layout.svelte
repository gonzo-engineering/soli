<script>
	import '$lib/styles/reset.css';
	import '$lib/styles/global.css';

	import { prettifyBalance } from '$lib/utils';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userState } from '$lib/global-state/index.svelte.js';

	export let data;

	let { supabase, session, profileData } = data;
	$: ({ supabase, session, profileData } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>Soli</title>
</svelte:head>

<header>
	<div><img class="search-icon" src="/search.png" alt="" /></div>
	<a href="/"><img src="/soli-logo-full-white.png" class="icon" alt="Soli emblem" /></a>
	{#if session}
		<a href="/account">Account</a>
	{:else}
		<a href="/login">Login</a>
	{/if}
</header>

<main>
	<slot />
</main>

<footer>
	<ul>
		<li>
			<a href="/about">About</a>
		</li>
		<li>
			<a href="/contact">Contact</a>
		</li>
	</ul>
	<div>
		Powered by <a href="https://gonzo.engineering"><span class="strong">Gonzo Engineering</span></a>
	</div>
</footer>

{#if userState.activeSong && userState.activeSongArtist && userState.liveBalance}
	<div class="audio-player">
		<div>Current balance: {prettifyBalance(userState.liveBalance)} tokens</div>
		<div>
			{userState.activeSong.name} by
			<a href={`/artists/${userState.activeSongArtist.artist.id}`}
				>{userState.activeSongArtist.artist.name}</a
			>
		</div>
		{#key userState.activeSong.url}
			<audio controls autoplay controlsList="nodownload noplaybackrate">
				<source src={userState.activeSong.url} type="audio/mpeg" />
				Your browser does not support the audio element.
			</audio>
		{/key}
	</div>
{/if}

<style>
	header,
	footer {
		text-align: center;
		margin: 1rem 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		max-height: 100px;
	}
	header a,
	footer a {
		text-decoration: none;
		color: inherit;
	}
	header {
		display: flex;
		justify-content: space-between;
		margin: 1rem;
	}
	footer {
		gap: 1rem;
	}
	.strong {
		font-weight: 500;
	}
	.icon {
		height: 50px;
	}
	footer {
		flex-direction: column;
	}
	footer ul {
		list-style: none;
		display: flex;
		gap: 1rem;
		padding: 0;
		margin: 0;
	}

	@media (max-width: 600px) {
		main {
			margin: 0 1rem;
		}
	}
	.audio-player {
		text-align: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		color: #333;
		background-color: #f0f0f0;
		padding: 1rem;
		a {
			color: black;
		}
	}
	.search-icon {
		width: 30px;
		height: 30px;
	}
</style>
