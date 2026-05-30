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
	import LabelView from '$lib/components/views/label/LabelView.svelte';
	import { APP_BASE } from '$lib/config';

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
				activeArtistSongs = await getArtistTracks(activeArtist.id);
				activeArtistReleases = await getArtistReleases(activeArtist.id);
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
		{#if dashboardState.activeSection === 'profile'}
			<LabelView activeLabel={dashboardState.activeLabel} />
		{:else if dashboardState.activeSection === 'artists'}
			<div class="label-artists">
				<h2>Artists on your label</h2>
				{#if dashboardState.activeLabel.artists.length > 0}
					<ul>
						{#each dashboardState.activeLabel.artists as artist}
							<li><a href={`${APP_BASE}/artist/${artist.id}`} target="_blank">{artist.name}</a></li>
						{/each}
					</ul>
				{:else}
					<p>You don't have any artists linked to your label yet.</p>
				{/if}
			</div>
		{/if}
	{:else}
		<div class="no-selection">
			<h2>Welcome to your dashboard</h2>
			<p>Please select an artist or label from the sidebar to get started.</p>
		</div>
	{/if}
</div>
