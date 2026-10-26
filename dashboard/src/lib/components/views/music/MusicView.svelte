<script lang="ts">
	import Card from '../../layout/Card.svelte';
	import AddReleaseForm from '../../forms/AddReleaseForm.svelte';
	import AddTrackToReleaseForm from '../../forms/AddTrackToReleaseForm.svelte';
	import UploadTrackForm from '../../forms/UploadTrackForm.svelte';
	import ReleaseInfo from './ReleaseInfo.svelte';
	import type { Artist, ReleaseHydrated, Track } from '@soli/shared/types';
	import TrackInfo from './TrackInfo.svelte';
	import { ButtonWrapper } from '@soli/shared/components';

	const {
		activeArtist,
		activeArtistSongs,
		activeArtistReleases,
		onTrackDeleted,
		onReleaseDeleted
	}: {
		activeArtist: Artist;
		activeArtistSongs: Track[];
		activeArtistReleases: ReleaseHydrated[];
		onTrackDeleted: () => void;
		onReleaseDeleted: () => void;
	} = $props();

	let activeForm: 'addRelease' | 'uploadTrack' | 'addTrackToRelease' | undefined =
		$state(undefined);
</script>

<div class="dashboard">
	{#if activeForm === 'addRelease'}
		<ButtonWrapper label="Close form" onClickFunction={() => (activeForm = undefined)}>
			<Card>Close form</Card>
		</ButtonWrapper>
		<AddReleaseForm artistId={activeArtist.id} />
	{:else if activeForm === 'uploadTrack'}
		<ButtonWrapper label="Close form" onClickFunction={() => (activeForm = undefined)}>
			<Card>Close form</Card>
		</ButtonWrapper>
		<UploadTrackForm artistId={activeArtist.id} />
	{:else if activeForm === 'addTrackToRelease'}
		<ButtonWrapper label="Close form" onClickFunction={() => (activeForm = undefined)}>
			<Card>Close form</Card>
		</ButtonWrapper>
		<AddTrackToReleaseForm releases={activeArtistReleases} tracks={activeArtistSongs} />
	{:else if activeForm === undefined}
		<div class="music-view">
			<div class="releases-list">
				<div class="section-header">
					<h2>
						Releases ({activeArtistReleases.length})
					</h2>
					<ButtonWrapper label="Add release" onClickFunction={() => (activeForm = 'addRelease')}>
						<Card>Add release</Card>
					</ButtonWrapper>
				</div>
				{#each activeArtistReleases as release}
					<Card>
						<ReleaseInfo {release} {onReleaseDeleted} />
					</Card>
				{/each}
			</div>
			<div class="songs-list">
				<div class="section-header">
					<h2>
						Songs ({activeArtistSongs.length})
					</h2>
					<ButtonWrapper label="Add track(s)" onClickFunction={() => (activeForm = 'uploadTrack')}>
						<Card>Upload track(s)</Card>
					</ButtonWrapper>
					<ButtonWrapper
						label="Add track to release"
						onClickFunction={() => (activeForm = 'addTrackToRelease')}
					>
						<Card>Add track to release</Card>
					</ButtonWrapper>
				</div>
				{#each activeArtistSongs as song}
					<Card>
						<TrackInfo {song} {onTrackDeleted} />
					</Card>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.dashboard {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		gap: 2rem;
	}
	.music-view {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		gap: 2rem;
	}
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
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
