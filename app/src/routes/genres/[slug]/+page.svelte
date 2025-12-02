<script lang="ts">
	import BreadcrumbLinks from '$lib/components/layout/BreadcrumbLinks.svelte';
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';

	let { data } = $props();

	const capitaliseFirstLetter = (word: string) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	};
</script>

<svelte:head>
	<title>{capitaliseFirstLetter(data.genre!)} · Soli</title>
	<meta name="description" content="Browse releases with the genres '{data.genre}' on Soli." />
</svelte:head>

<BreadcrumbLinks breadcrumbs={[{ link: '/genres', label: 'Genres' }]} />

<h2>{capitaliseFirstLetter(data.genre!)}</h2>
{#if data.genreReleases}
	<ReleaseCardGrid releases={data.genreReleases} />
{/if}
