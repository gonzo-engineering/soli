<script lang="ts">
	import type { Artist, Release } from '$lib/types';

	let { data }: { data: { artist: Artist; releases: Release[] } } = $props();

	const { name, description, website } = data.artist;
</script>

<svelte:head>
	<title>{name} · Soli</title>
	<meta name="description" content={`The artist page for ${name}.`} />
</svelte:head>

<h2>{name}</h2>

<a href={website}>{website.replace('https://', '')}</a>

<div>{description}</div>

<h3>Releases</h3>

<div class="releases-container">
	{#each data.releases as { id, name }}
		<a href={`/releases/${id}`}>
			<div class="release-square">
				<h4>{name}</h4>
			</div>
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
