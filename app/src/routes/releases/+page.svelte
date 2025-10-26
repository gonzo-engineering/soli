<script lang="ts">
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import type { ReleaseHydrated } from '../../../../shared/types/hydrated';

	let { data }: { data: { releases: ReleaseHydrated[] } } = $props();
</script>

<svelte:head>
	<title>Releases · Soli</title>
	<meta name="description" content="All the musical releases on Soli." />
</svelte:head>

<h2>Releases</h2>

<ReleaseCardGrid releases={data.releases} />
