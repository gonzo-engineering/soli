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
	import { makeImageLink } from '$lib/utils';

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
	{:else if dashboardState.activeLabel}
		<div>
			<h2>{dashboardState.activeLabel.name}</h2>
			{#if dashboardState.activeLabel.image_cid}
				<img
					src={makeImageLink(dashboardState.activeLabel.image_cid, 500)}
					alt="{dashboardState.activeLabel.name} logo"
					class="label-logo"
				/>
			{/if}
			<p>{dashboardState.activeLabel.description}</p>
			<a href={dashboardState.activeLabel.website_url} target="_blank" rel="noopener noreferrer"
				>{dashboardState.activeLabel.website_url}</a
			>
		</div>
	{:else}
		<div class="no-selection">
			<h2>Welcome to your dashboard</h2>
			<p>Please select an artist or label from the sidebar to get started.</p>
		</div>
	{/if}
</div>
