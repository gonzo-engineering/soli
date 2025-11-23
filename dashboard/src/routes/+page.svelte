<script lang="ts">
	import type { GroupListResponse } from 'pinata';
	import type { StreamLog } from '../../../shared/types/core';
	import { dashboardState } from '$lib/state.svelte';
	import ProfileView from '$lib/components/views/profile/ProfileView.svelte';
	import type { Artist, Release, Track } from '../../../shared/types/core';
	import type { ReleaseHydrated } from '../../../shared/types/hydrated';
	import StatsView from '$lib/components/views/stats/StatsView.svelte';
	import MusicView from '$lib/components/views/music/MusicView.svelte';

	let {
		data
	}: {
		data: {
			groups: GroupListResponse;
			artists: Artist[];
			songs: Track[];
			releases: ReleaseHydrated[];
			streams: StreamLog[];
		};
	} = $props();

	let activeArtist: Artist | null = $derived(
		data.artists.find((artist) => artist.id === dashboardState.activeArtist?.id) || null
	);
	let activeArtistSongs = $derived(
		data.songs.filter((song) => song.artist_id === activeArtist?.id)
	);
	let activeArtistReleases = $derived(
		data.releases.filter((release) => release.artist_id === activeArtist?.id)
	);
	let activeArtistStreams = $derived(
		data.streams.filter((stream) => stream.artist_id === activeArtist?.id)
	);
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
