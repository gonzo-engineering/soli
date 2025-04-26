<script lang="ts">
	import type { Artist, ReleaseHydrated } from '$lib/types';

	let { data }: { data: { artist: Artist; releases: ReleaseHydrated[] } } = $props();

	const { name, description, website } = data.artist;
</script>

<svelte:head>
	<title>{name} · Soli</title>
	<meta name="description" content={`The artist page for ${name}.`} />
</svelte:head>

<small>Artists</small>

<h2>{name}</h2>

<a href={website}>{website.replace('https://', '').replaceAll('/', '')}</a>

<div>{description}</div>

<h3>Releases</h3>

<div class="releases-container">
	{#each data.releases as { id, name, coverLink }}
		<a href={`/releases/${id}`}>
			<div class="release-square">
				<img src={coverLink} alt={`Cover art for '${name}'`} />
			</div>
			<h4>{name}</h4>
		</a>
	{/each}
</div>

<style>
	.releases-container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
	.release-square {
		width: 100px;
		height: 100px;
		border-radius: 10px;
		color: black;
		background-color: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
