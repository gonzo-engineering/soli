<script lang="ts">
	import type { ReleaseHydrated } from '$lib/types';
	import { prettifyDuration } from '$lib/utils';
	import { user, setActiveSong } from '$lib/stores/userStore.svelte';

	let { data }: { data: { release: ReleaseHydrated } } = $props();

	const release = data.release;
</script>

<svelte:head>
	<title>{release.name} · Releases · Soli</title>
	<meta
		name="description"
		content={`The release page for ${release.name} by ${release.artist.name}.`}
	/>
</svelte:head>

<small>Releases</small>

<h2>{release.name}</h2>

<div>
	<a href={`/artists/${release.artist.id}`}>{release.artist.name}</a>
</div>

<div>
	{release.type} released {new Date(release.releaseDate).toLocaleDateString()}
</div>

<img
	src={release.coverLink}
	alt={`Cover art for '${release.name}' by ${release.artist.name}'`}
	class="cover-art"
/>

<table>
	<thead>
		<tr>
			<th></th>
			<th>Track</th>
			<th>Duration</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each release.tracks as track, i}
			<tr>
				<td>{i + 1}</td>
				<td>{track.name}</td>
				<td>{prettifyDuration(track.durationInSeconds)}</td>
				<td>
					<button class="play-button" onclick={() => setActiveSong(track, release.artist)}>
						{#if track.CID === user.activeSong?.CID}
							<span>Playing</span>
						{:else}
							<span>Play</span>
						{/if}
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.cover-art {
		aspect-ratio: 1/1;
		background-color: lightgray;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}
</style>
