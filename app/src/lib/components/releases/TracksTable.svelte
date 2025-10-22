<script lang="ts">
	import type { ReleaseHydrated, TrackRaw } from '../../../../../shared/types';
	import TrackTableRow from './TracksTableRow.svelte';

	const {
		tracksAndTheirReleases,
		showReleaseAndArtist = false
	}: {
		tracksAndTheirReleases: { track: TrackRaw; release: ReleaseHydrated }[];
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
		{#each tracksAndTheirReleases as { track, release }, i}
			<TrackTableRow i={i + 1} {track} {release} {showReleaseAndArtist} />
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
