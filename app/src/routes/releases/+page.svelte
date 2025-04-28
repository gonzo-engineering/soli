<script lang="ts">
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import type { Release } from '$lib/types';

	let { data }: { data: { releases: Release[] } } = $props();
</script>

<svelte:head>
	<title>Releases · Soli</title>
	<meta name="description" content="All the musical releases on Soli." />
</svelte:head>

<h2>Releases</h2>

<ReleaseCardGrid releases={data.releases} />
