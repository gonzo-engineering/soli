<script lang="ts">
	import type { ReleaseHydrated } from '@soli/shared/types/hydrated';
	import GridWrapper from '$lib/components/GridWrapper.svelte';
	import ReleaseCard from '$lib/components/ReleaseCard.svelte';
	import { makeImageLink } from '$lib/utils';

	let { data }: { data: { releases: ReleaseHydrated[] } } = $props();
</script>

<svelte:head>
	<title>Releases · Soli</title>
	<meta name="description" content="All the musical releases on Soli." />
</svelte:head>

<h2>Releases</h2>

<GridWrapper gridItemSize="150px" gridGap="20px">
	{#each data.releases as release}
		<ReleaseCard
			link={`/releases/${release.id}`}
			name={release.title}
			artist={release.artist.name}
			coverArt={makeImageLink(release.artwork_ipfs_cid, 200)}
		/>
	{/each}
</GridWrapper>
