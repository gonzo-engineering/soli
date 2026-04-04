<script lang="ts">
	import type { TrackHydrated } from '../../../../../shared/types/hydrated';
	import { prettifyDuration } from '../../../../../shared/utils';
	import ReleaseTrackButton from './ReleaseTrackButton.svelte';
	import TrackLikeButton from './TrackLikeButton.svelte';
	import PopupWrapper from '../layout/PopupWrapper.svelte';
	import { addTrackToMixtape } from '$lib/remote-functions/mixtapes.remote';
	import ButtonWrapper from '../layout/ButtonWrapper.svelte';
	import type { Mixtape, Listener } from '../../../../../shared/types/core';
	import Icon from '../layout/Icon.svelte';

	const {
		i = undefined,
		track,
		showReleaseAndArtist = false,
		userProfile,
		mixtapes,
		likedTracks
	}: {
		i?: number;
		track: TrackHydrated;
		showReleaseAndArtist: boolean;
		userProfile: Listener;
		mixtapes: Mixtape[];
		likedTracks: TrackHydrated[];
	} = $props();

	let popupMenuOpen = $state(false);
</script>

<tr>
	<td>{i || ''}</td>
	<td>{track.title}</td>
	{#if showReleaseAndArtist}
		<td class="hide-on-mobile"
			><a href={`/releases/${track.release.id}`}>{track.release.title}</a></td
		>
		<td><a href={`/artists/${track.artist.id}`}>{track.artist.name}</a></td>
	{/if}
	<td>{prettifyDuration(track.duration_seconds)}</td>
	<td class="play-button-container">
		<ReleaseTrackButton {track} release={track.release} {userProfile} />
	</td>
	{#if userProfile}
		<td>
			<TrackLikeButton trackID={track.id} {likedTracks} />
		</td>
		<td>
			<ButtonWrapper label="More options" onClickFunction={() => (popupMenuOpen = !popupMenuOpen)}>
				<Icon key="threeDots" size={20} />
			</ButtonWrapper>
		</td>
	{/if}
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
						{#each mixtapes as mixtape}
							<option value={mixtape.id}>{mixtape.name}</option>
						{/each}
					</select>
				</label>
				<input {...addTrackToMixtape.fields.trackId.as('hidden', track.id)} />
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
