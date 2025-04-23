<script lang="ts">
	import type { Artist } from '$lib/types';

	let { data }: { data: { artist: Artist } } = $props();

	const { name } = data.artist;
</script>

<svelte:head>
	<title>{name} · Soli</title>
	<meta name="description" content={`The artist page for ${name}.`} />
</svelte:head>

<h2>{name}</h2>
