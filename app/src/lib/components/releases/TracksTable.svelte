<script lang="ts">
	import type { TrackHydrated } from '../../../../../shared/types/hydrated';
	import TrackTableRow from './TracksTableRow.svelte';

	const {
		tracks,
		showReleaseAndArtist = false
	}: {
		tracks: TrackHydrated[];
		showReleaseAndArtist?: boolean;
	} = $props();
</script>

<table>
	<thead>
		<tr>
			<th>#</th>
			<th>Track</th>
			{#if showReleaseAndArtist}
				<th class="hide-on-mobile">Release</th>
				<th>Artist</th>
			{/if}
			<th>Duration</th>
			<th></th>
			<th></th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each tracks as track, i}
			<TrackTableRow i={i + 1} {track} {showReleaseAndArtist} />
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
	.hide-on-mobile {
		display: none;
	}
	@media (min-width: 640px) {
		.hide-on-mobile {
			display: table-cell;
		}
	}
</style>
