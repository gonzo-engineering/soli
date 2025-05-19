<script>
	import '$lib/styles/reset.css';
	import '$lib/styles/global.css';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userState } from '$lib/global/state.svelte.js';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

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
	<meta name="theme-color" content="#1e1e1e" />
</svelte:head>

<Header userIsLoggedIn={session} />

<main>
	<slot />
</main>

<Footer />

{#if userState.activeSong && userState.activeSongArtist && userState.liveBalance}
	<div class="audio-player">
		<!-- <div>Current balance: {prettifyBalance(userState.liveBalance)} tokens</div> -->
		<div>
			{userState.activeSong.title} by
			<a href={`/artists/${userState.activeSongArtist.artistId}`}
				>{userState.activeSongArtist.artistName}</a
			>
		</div>
		{#key userState.activeSong.ipfs_cid}
			<audio controls autoplay controlsList="nodownload noplaybackrate">
				<source src={userState.activeSongUrl} type="audio/mpeg" />
				Your browser does not support the audio element.
			</audio>
		{/key}
	</div>
{/if}

<style>
	main {
		margin: 0 1rem;
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
</style>
