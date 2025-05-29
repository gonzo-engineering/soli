<script>
	import '$lib/styles/reset.css';
	import '$lib/styles/global.css';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userState } from '$lib/global/state.svelte.js';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import AudioPlayer from '$lib/components/audio-player/AudioPlayer.svelte';

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
	<meta name="theme-color" content="#1e1e1e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#f0f0f0" media="(prefers-color-scheme: light)" />
</svelte:head>

<Header userIsLoggedIn={session} />

<main>
	<slot />
</main>

<Footer />

{#if userState.activeSong && userState.activeSongRelease && userState.liveBalance && userState.activeSongUrl && data.session?.user.id && data.profileData?.pay_per_stream}
	<AudioPlayer
		userId={data.session?.user.id}
		userPayPerStream={data.profileData?.pay_per_stream}
		title={userState.activeSong.title}
		release={userState.activeSongRelease}
		songUrl={userState.activeSongUrl}
	/>
{/if}

<style>
	main {
		margin: 0 1rem;
	}
</style>
