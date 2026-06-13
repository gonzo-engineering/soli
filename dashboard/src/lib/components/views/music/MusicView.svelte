<script lang="ts">
	import Card from '../../layout/Card.svelte';
	import AddReleaseForm from '../../forms/AddReleaseForm.svelte';
	import AddTrackToReleaseForm from '../../forms/AddTrackToReleaseForm.svelte';
	import UploadTrackForm from '../../forms/UploadTrackForm.svelte';
	import ReleaseInfo from './ReleaseInfo.svelte';
	import type { Artist, Track } from '@soli/shared/types/core';
	import type { ReleaseHydrated } from '@soli/shared/types/hydrated';
	import TrackInfo from './TrackInfo.svelte';

	const {
		activeArtist,
		activeArtistSongs,
		activeArtistReleases
	}: {
		activeArtist: Artist;
		activeArtistSongs: Track[];
		activeArtistReleases: ReleaseHydrated[];
	} = $props();
</script>

<div class="dashboard">
	<div class="releases-list">
		<h2>
			Releases ({activeArtistReleases.length})
		</h2>
		{#each activeArtistReleases as release}
			<Card>
				<ReleaseInfo {release} />
			</Card>
		{/each}
	</div>
	<div class="songs-list">
		<h2>
			Songs ({activeArtistSongs.length})
		</h2>
		{#each activeArtistSongs as song}
			<Card>
				<TrackInfo {song} />
			</Card>
		{/each}
	</div>
	<div>
		<h2>Manage</h2>
		<div class="forms">
			<Card>
				<UploadTrackForm artistId={activeArtist.id} />
			</Card>
			<Card>
				<AddReleaseForm artistId={activeArtist.id} />
			</Card>
			<Card>
				<AddTrackToReleaseForm releases={activeArtistReleases} tracks={activeArtistSongs} />
			</Card>
		</div>
	</div>
</div>

<style>
	.dashboard {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		gap: 2rem;
	}
	.releases-list,
	.songs-list {
		min-width: 300px;
		max-width: 500px;
	}
	.releases-list {
		flex: 2;
	}
	.songs-list {
		flex: 1;
	}
	.forms {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex: 1;
	}
</style>
