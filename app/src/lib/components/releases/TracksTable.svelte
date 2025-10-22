<script lang="ts">
	import type {
		LikedTrackObject,
		Mixtape,
		ReleaseHydrated,
		UserProfile
	} from '../../../../../shared/types';
	import type { Session } from '@supabase/supabase-js';
	import TrackTableRow from './TracksTableRow.svelte';

	const {
		release,
		profileData,
		likedTracks,
		mixtapes,
		session,
		showReleaseAndArtist = false
	}: {
		release: ReleaseHydrated;
		profileData: UserProfile;
		likedTracks: LikedTrackObject[];
		mixtapes: Mixtape[];
		session: Session;
		showReleaseAndArtist?: boolean;
	} = $props();
</script>

<table>
	<thead>
		<tr>
			<th>#</th>
			<th>Track</th>
			{#if showReleaseAndArtist}
				<th>Release</th>
				<th>Artist</th>
			{/if}
			<th>Duration</th>
			<th></th>
			<th></th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each release.tracks as track, i}
			<TrackTableRow
				i={i + 1}
				{track}
				{release}
				{profileData}
				{session}
				{likedTracks}
				{mixtapes}
				{showReleaseAndArtist}
			/>
		{/each}
	</tbody>
</table>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}
	th {
		font-weight: 500;
	}
</style>
