<script lang="ts">
	import TagsGrid from '$lib/components/tags/TagsGrid.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Genres · Soli</title>
	<meta name="description" content="Browse releases by genre on Soli." />
</svelte:head>

<h2>Genres</h2>
<TagsGrid slugs={data.genres} type="genres" />
