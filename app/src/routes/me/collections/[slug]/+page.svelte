<script lang="ts">
	import SectionLink from '$lib/components/layout/SectionLink.svelte';
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import { deleteCollection, getCollection } from '$lib/remote-functions/collections.remote';

	let { params } = $props();

	let collectionPromise = $derived(getCollection(params.slug));
	let { id, name, description, releases } = $derived(await collectionPromise);
</script>

<svelte:head>
	<title>{name} · Your collections · Soli</title>
	<meta name="description" content={`Browse the collection '${name}' on Soli.`} />
</svelte:head>

<SectionLink link="/me/collections" label="Your collections" />

<h2>{name}</h2>

{#if description}
    <div>{description}</div>
{/if}

<ReleaseCardGrid {releases} />
<form {...deleteCollection.for(id)}>
	<input {...deleteCollection.fields.collectionId.as('hidden')} value={id} />
	<button type="submit">Delete collection</button>
</form>
