<script lang="ts">
	import {
		editRelease,
		addTrackToRelease,
		removeTrackFromRelease
	} from '$lib/remote-functions/music.remote';
	import { makeImageLink } from '$lib/utils';
	import type { ReleaseHydrated, Track } from '@soli/shared/types';

	const {
		release,
		availableTracks,
		onReleaseUpdated,
		onTracksChanged
	}: {
		release: ReleaseHydrated;
		availableTracks: Track[];
		onReleaseUpdated: () => void;
		onTracksChanged: () => void;
	} = $props();

	const editPending = $derived(!!editRelease.pending);
	const addPending = $derived(!!addTrackToRelease.pending);

	let removingTrackId = $state<string | null>(null);

	// Only offer tracks that aren't already on this release
	const unassignedTracks = $derived(
		availableTracks.filter((t) => !release.tracks.some((rt) => rt.id === t.id))
	);

	const nextTrackNumber = $derived(release.tracks.length + 1);

	const handleRemove = async (trackId: string) => {
		removingTrackId = trackId;
		try {
			await removeTrackFromRelease({ releaseId: release.id, trackId });
			onTracksChanged();
		} finally {
			removingTrackId = null;
		}
	};
</script>

<h3>Edit release - {release.title}</h3>

<div class="release-forms">
	<div class="release-details-form">
		<form
			{...editRelease.enhance(async ({ submit }) => {
				if (await submit()) {
					onReleaseUpdated();
				}
			})}
			enctype="multipart/form-data"
			class:pending={editPending}
		>
			<input {...editRelease.fields.releaseId.as('hidden', release.id)} />

			{#if release.artwork_ipfs_cid}
				<img src={makeImageLink(release.artwork_ipfs_cid, 300)} alt="Current artwork" />
			{/if}
			<label>
				Artwork
				<input {...editRelease.fields.releaseArtwork.as('file')} disabled={editPending} />
			</label>
			<label>
				Title
				<input
					{...editRelease.fields.releaseName.as('text', release.title)}
					disabled={editPending}
				/>
			</label>
			<label>
				Type
				<select
					{...editRelease.fields.releaseType.as('select', release.release_type)}
					disabled={editPending}
				>
					<option value="album">Album</option>
					<option value="ep">EP</option>
					<option value="single">Single</option>
				</select>
			</label>
			<label>
				Release date
				<input
					{...editRelease.fields.releaseDate.as('date', release.release_date)}
					disabled={editPending}
				/>
			</label>
			<label>
				Genres
				<input
					{...editRelease.fields.releaseGenres.as('text', release.genres?.join(', ') ?? '')}
					disabled={editPending}
					placeholder="e.g. Rock, Folk, Ambient"
				/>
			</label>

			<button type="submit" disabled={editPending}>
				{editPending ? 'Saving...' : 'Save changes'}
			</button>
		</form>
	</div>

	<div class="release-tracks-form">
		<h4>Tracks on this release</h4>
		{#if release.tracks.length === 0}
			<p>No tracks added yet.</p>
		{:else}
			{#each release.tracks as track, i (track.id)}
				<div class="track-row">
					<span>{i + 1}. {track.title}</span>
					<button
						type="button"
						disabled={removingTrackId !== null}
						onclick={() => handleRemove(track.id)}
					>
						{removingTrackId === track.id ? 'Removing...' : 'Remove'}
					</button>
				</div>
			{/each}
		{/if}

		<h4>Add a track</h4>
		{#if unassignedTracks.length === 0}
			<p>All of your tracks are already on this release.</p>
		{:else}
			<form
				{...addTrackToRelease.enhance(async ({ element, submit }) => {
					if (await submit()) {
						element.reset();
						onTracksChanged();
					}
				})}
				class:pending={addPending}
			>
				<input {...addTrackToRelease.fields.releaseId.as('hidden', release.id)} />
				<label>
					Track
					<select {...addTrackToRelease.fields.trackId.as('select')} disabled={addPending}>
						{#each unassignedTracks as track (track.id)}
							<option value={track.id}>{track.title}</option>
						{/each}
					</select>
				</label>
				<label>
					Track number
					<input
						{...addTrackToRelease.fields.trackNumber.as('number', nextTrackNumber)}
						disabled={addPending}
					/>
				</label>
				<button type="submit" disabled={addPending}>
					{addPending ? 'Adding...' : 'Add track'}
				</button>
			</form>
		{/if}
	</div>
</div>

<style>
	form.pending {
		opacity: 0.6;
		pointer-events: none;
		cursor: wait;
		transition: opacity 0.2s ease;
	}
	.track-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.25rem 0;
	}
	img {
		max-width: 300px;
		border-radius: 4px;
	}
	.release-forms {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		@media (min-width: 600px) {
			flex-direction: row;
			gap: 2rem;
		}
		/* Children have min width of 300px */
		> * {
			min-width: 500px;
		}
	}
</style>
