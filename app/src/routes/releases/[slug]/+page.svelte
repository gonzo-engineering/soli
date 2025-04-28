<script lang="ts">
	import type { ArtistManifest, Release } from '$lib/types';
	import { prettifyDuration } from '$lib/utils';
	import { user, setActiveSong } from '$lib/stores/userStore.svelte';

	let { data }: { data: { release: Release; artistManifest: ArtistManifest } } = $props();

	const release = data.release;
	const artist = data.artistManifest;
</script>

<svelte:head>
	<title>{release.title} · Releases · Soli</title>
	<meta
		name="description"
		content={`The release page for ${release.title} by ${release.artistName}.`}
	/>
</svelte:head>

<small>Releases</small>

<h2>{release.title}</h2>

<div>
	<a href={`/artists/${artist.artist.id}`}>{release.artistName}</a>
</div>

<div>
	{release.type} released {new Date(release.release_date).toLocaleDateString()}
</div>

<img
	src={release.coverLink}
	alt={`Cover art for '${release.title}' by ${release.artistName}'`}
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
				<td>{prettifyDuration(track.duration_in_seconds)}</td>
				<td>
					<button class="play-button" onclick={() => setActiveSong(track, artist)}>
						{#if track.cid === user.activeSong?.cid}
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
