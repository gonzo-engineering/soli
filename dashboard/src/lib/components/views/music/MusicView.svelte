<script lang="ts">
	import Card from '../../layout/Card.svelte';
	import AddReleaseForm from '../../forms/AddReleaseForm.svelte';
	import EditReleaseForm from '../../forms/EditReleaseForm.svelte';
	import UploadTrackForm from '../../forms/UploadTrackForm.svelte';
	import ReleaseInfo from './ReleaseInfo.svelte';
	import type { Artist, ReleaseHydrated, Track } from '@soli/shared/types';
	import TrackInfo from './TrackInfo.svelte';
	import { ButtonWrapper } from '@soli/shared/components';
	import { getArtistReleases, getArtistTracks } from '$lib/remote-functions/artist.remote';

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

	type ActiveForm =
		| { type: 'addRelease' }
		| { type: 'uploadTrack' }
		| { type: 'editRelease'; releaseId: string }
		| undefined;

	let activeForm: ActiveForm = $state(undefined);

	// Always look up the live release so the form reflects refreshed data
	const editingRelease = $derived.by(() => {
		if (activeForm?.type !== 'editRelease') return undefined;
		const releaseId = activeForm.releaseId;
		return activeArtistReleases.find((r) => r.id === releaseId);
	});

	const closeForm = () => (activeForm = undefined);

	const refreshReleases = () => getArtistReleases(activeArtist.id).refresh();
	const refreshTracks = () => getArtistTracks(activeArtist.id).refresh();

	let notice = $state<string | null>(null);
	let noticeTimeout: ReturnType<typeof setTimeout>;

	const showNotice = (message: string) => {
		notice = message;
		clearTimeout(noticeTimeout);
		noticeTimeout = setTimeout(() => (notice = null), 4000);
	};
</script>

<div class="dashboard">
	{#if notice}
		<div class="notice" role="status">{notice}</div>
	{/if}
	{#if activeForm}
		<div class="form-wrapper">
			<div class="close-form-button">
				<ButtonWrapper label="Close form" onClickFunction={closeForm}>
					<Card>Close form</Card>
				</ButtonWrapper>
			</div>
			{#if activeForm.type === 'addRelease'}
				<AddReleaseForm artistId={activeArtist.id} />
			{:else if activeForm.type === 'uploadTrack'}
				<UploadTrackForm
					artistId={activeArtist.id}
					onTrackUploaded={(title) => {
						refreshTracks();
						closeForm();
						showNotice(`"${title}" uploaded`);
					}}
				/>
			{:else if activeForm.type === 'editRelease' && editingRelease}
				<EditReleaseForm
					release={editingRelease}
					availableTracks={activeArtistSongs}
					onReleaseUpdated={() => {
						refreshReleases();
						closeForm();
					}}
					onTracksChanged={() => {
						refreshReleases();
						refreshTracks();
					}}
				/>
			{/if}
		</div>
	{:else}
		<div class="music-view">
			<div class="releases-list">
				<div class="section-header">
					<h2>Releases ({activeArtistReleases.length})</h2>
					<ButtonWrapper
						label="Add release"
						onClickFunction={() => (activeForm = { type: 'addRelease' })}
					>
						<Card>Add release</Card>
					</ButtonWrapper>
				</div>
				{#each activeArtistReleases as release}
					<Card>
						<ReleaseInfo
							{release}
							{onReleaseDeleted}
							onEditRelease={() => (activeForm = { type: 'editRelease', releaseId: release.id })}
						/>
					</Card>
				{/each}
			</div>
			<div class="songs-list">
				<div class="section-header">
					<h2>Songs ({activeArtistSongs.length})</h2>
					<ButtonWrapper
						label="Upload track"
						onClickFunction={() => (activeForm = { type: 'uploadTrack' })}
					>
						<Card>Upload track</Card>
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
		max-width: 1000px;
	}
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.releases-list,
	.songs-list {
		max-width: 600px;
	}
	.releases-list {
		flex: 2;
	}
	.songs-list {
		flex: 1;
	}
	.form-wrapper {
		position: relative;
		max-width: 600px;
	}
	.close-form-button {
		position: absolute;
		top: 0;
		right: 0;
	}
	.notice {
		padding: 0.75rem 1rem;
		border-radius: 4px;
		background-color: #2f4f3a;
		color: white;
	}
</style>
