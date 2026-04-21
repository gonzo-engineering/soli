<script lang="ts">
	import GridWrapper from '$lib/components/GridWrapper.svelte';
	import BreadcrumbLinks from '$lib/components/layout/BreadcrumbLinks.svelte';
	import ReleaseCard from '$lib/components/ReleaseCard.svelte';
	import { makeImageLink } from '$lib/utils/index.js';

	let { data } = $props();

	const capitaliseFirstLetter = (word: string) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	};
</script>

<svelte:head>
	<title>{capitaliseFirstLetter(data.genre!)} · Soli</title>
	<meta name="description" content={`Browse releases with the genres '${data.genre}' on Soli.`} />
</svelte:head>

<BreadcrumbLinks breadcrumbs={[{ link: '/genres', label: 'Genres' }]} />

<h2>{capitaliseFirstLetter(data.genre!)}</h2>
{#if data.genreReleases}
	<GridWrapper gridItemSize="150px" gridGap="20px">
		{#each data.genreReleases as release}
			<ReleaseCard
				link={`/releases/${release.id}`}
				name={release.title}
				artist={release.artist.name}
				coverArt={makeImageLink(release.artwork_ipfs_cid, 200)}
			/>
		{/each}
	</GridWrapper>
{/if}
