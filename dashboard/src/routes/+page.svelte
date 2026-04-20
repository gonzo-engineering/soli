<script lang="ts">
	import type { StreamLog } from '../../../shared/types/core';
	import { dashboardState } from '$lib/state.svelte';
	import ProfileView from '$lib/components/views/profile/ProfileView.svelte';
	import type { Artist, Track } from '../../../shared/types/core';
	import type { ReleaseHydrated } from '../../../shared/types/hydrated';
	import StatsView from '$lib/components/views/stats/StatsView.svelte';
	import MusicView from '$lib/components/views/music/MusicView.svelte';
	import { getArtistReleases, getArtistTracks } from '$lib/remote-functions/artist.remote';
	import { getArtistStreams } from '$lib/remote-functions/stats.remote';

	let {
		data
	}: {
		data: {
			artists: Artist[];
			songs: Track[];
			releases: ReleaseHydrated[];
			streams: StreamLog[];
		};
	} = $props();

	let activeArtist: Artist | null = $derived(
		data.artists.find((artist) => artist.id === dashboardState.activeArtist?.id) || null
	);
	let activeArtistStreams: StreamLog[] = $state([]);
	let activeArtistSongs: Track[] = $state([]);
	let activeArtistReleases: ReleaseHydrated[] = $state([]);

	$effect(() => {
		const fetchArtistData = async () => {
			if (activeArtist) {
				activeArtistStreams = await getArtistStreams(activeArtist.id);
				activeArtistSongs = await getArtistTracks(activeArtist.id).run();
				activeArtistReleases = await getArtistReleases(activeArtist.id).run();
			} else {
				activeArtistStreams = [];
				activeArtistSongs = [];
				activeArtistReleases = [];
			}
		};
		fetchArtistData();
	});
</script>

<svelte:head>
	<title>Dashboard · Soli</title>
	<meta name="description" content="Upload and manage your music." />
</svelte:head>

<div>
	{#if activeArtist}
		{#if dashboardState.activeSection === 'music'}
			<MusicView {activeArtist} {activeArtistSongs} {activeArtistReleases} />
		{:else if dashboardState.activeSection === 'profile'}
			<ProfileView {activeArtist} />
		{:else if dashboardState.activeSection === 'stats'}
			<StatsView streams={activeArtistStreams} />
		{/if}
	{:else}
		<div>Select an artist to manage their releases and songs.</div>
	{/if}
</div>
