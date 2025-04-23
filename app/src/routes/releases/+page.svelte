<script lang="ts">
	import type { Release } from '$lib/types';

	let { data }: { data: { releases: Release[] } } = $props();
</script>

<svelte:head>
	<title>Releases · Soli</title>
	<meta name="description" content="All the musical releases on Soli." />
</svelte:head>

<h2>Releases</h2>

{#each data.releases as release}
	<div class="artist-circle">
		<a href={`/releases/${release.id}`}><h3>{release.name}</h3></a>
	</div>
{/each}
