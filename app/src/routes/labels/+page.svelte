<script lang="ts">
	import GridWrapper from '$lib/components/GridWrapper.svelte';
	import CircleCard from '$lib/components/CircleCard.svelte';
	import { makeImageLink } from '$lib/utils';
	import type { Label } from '../../../../shared/types/core';

	let { data }: { data: { labels: Label[] } } = $props();
</script>

<svelte:head>
	<title>Labels · Soli</title>
	<meta name="description" content="All the record labels on Soli." />
</svelte:head>

<h2>Labels</h2>

<GridWrapper gridItemSize="150px" gridGap="20px">
	{#each data.labels as label}
		<CircleCard
			link={`/labels/${label.id}`}
			name={label.name}
			image={label.image_cid ? makeImageLink(label.image_cid, 200) : '/placeholder-label.png'}
		/>
	{/each}
</GridWrapper>
