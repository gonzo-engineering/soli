<script lang="ts">
	import TracksTableRow from '$lib/components/releases/TracksTableRow.svelte';

	let { data } = $props();
</script>

<h2>Your liked tracks</h2>

{#if data.session}
	<table>
		<thead>
			<tr>
				<th></th>
				<th>Track</th>
				<th>Artist</th>
				<th>Duration</th>
				<th></th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each data.likedTracks as { track, release }}
				<TracksTableRow
					{track}
					{release}
					session={data.session}
					profileData={data.profileData}
					likedTracks={data.likedTracks}
					showArtist={true}
				/>
			{/each}
		</tbody>
	</table>
{/if}

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
