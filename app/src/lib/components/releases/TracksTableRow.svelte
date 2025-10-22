<script lang="ts">
	import type { ReleaseHydrated, TrackRaw } from '../../../../../shared/types';
	import { prettifyDuration } from '../../../../../shared/utils';
	import ReleaseTrackButton from './ReleaseTrackButton.svelte';
	import TrackLikeButton from './TrackLikeButton.svelte';
	import ThreeDots from '../icons/ThreeDots.svelte';
	import PopupWrapper from '../layout/PopupWrapper.svelte';
	import { addTrackToMixtape } from '$lib/remote-functions/mixtapes.remote';
	import { userState } from '$lib/global/state.svelte';

	const {
		i = undefined,
		track,
		release,
		showReleaseAndArtist = false
	}: {
		i?: number;
		track: TrackRaw;
		release: ReleaseHydrated;
		showReleaseAndArtist: boolean;
	} = $props();

	let popupMenuOpen = $state(false);
</script>

<tr>
	<td>{i || ''}</td>
	<td>{track.title}</td>
	{#if showReleaseAndArtist}
		<td class="hide-on-mobile"><a href={`/releases/${release.id}`}>{release.title}</a></td>
		<td><a href={`/artists/${release.artist_id}`}>{release.artist_name}</a></td>
	{/if}
	<td>{prettifyDuration(track.duration_seconds)}</td>
	<td class="play-button-container">
		<ReleaseTrackButton {track} {release} />
	</td>
	<td>
		<TrackLikeButton
			trackID={track.id}
			likedTracks={userState.music.likedTracks}
			lightOrDark={'light'}
		/>
	</td>
	<td>
		<div onclick={() => (popupMenuOpen = !popupMenuOpen)}><ThreeDots /></div>
	</td>
</tr>

{#if popupMenuOpen}
	<PopupWrapper bind:popupMenuOpen>
		<div>
			<h3>Track options for "{track.title}"</h3>
			<form {...addTrackToMixtape}>
				<label
					>Add to mixtape:
					<select {...addTrackToMixtape.fields.mixtapeId.as('select')}>
						<option value="" disabled selected>Select a mixtape</option>
						{#each userState.music.mixtapes as mixtape}
							<option value={mixtape.id}>{mixtape.name}</option>
						{/each}
					</select>
				</label>
				<input {...addTrackToMixtape.fields.trackId.as('hidden')} value={track.id} />
				<button type="submit">Add</button>
			</form>
		</div>
	</PopupWrapper>
{/if}

<style>
	tr {
		line-height: 1.1;
	}
	tr:not(:last-child) {
		border-bottom: 1px solid gray;
	}
	.hide-on-mobile {
		display: none;
	}
	@media (min-width: 640px) {
		.hide-on-mobile {
			display: table-cell;
		}
	}
</style>
