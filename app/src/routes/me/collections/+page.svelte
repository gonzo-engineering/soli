<script lang="ts">
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import { makeCollection, deleteCollection } from '$lib/remote-functions/collections.remote';
	import type { CollectionHydrated } from '../../../../../shared/types/hydrated';

	let { data } = $props();

	const collections: CollectionHydrated[] = data.collections;
</script>

<svelte:head>
	<title>Your collections · Soli</title>
	<meta name="description" content="Browse your collections on Soli." />
</svelte:head>

<h2>Your collections</h2>

{#each collections as collection}
	<a href="/me/collections/{collection.id}" class="collection">
		<div class="collection-details">
			<h3>{collection.name}</h3>
			{#if collection.description}
				<div>{collection.description}</div>
			{/if}
			<div>{collection.releases.length} releases</div>
		</div>
	</a>
{/each}

{#if data.user}
	<h3>Create a new collection</h3>

	<form {...makeCollection}>
		<label>
			Name
			<input {...makeCollection.fields.name.as('text')} />
		</label>
		<label>
			Description
			<input {...makeCollection.fields.description.as('text')} />
		</label>
		<button type="submit">Create</button>
	</form>
{/if}

<style>
	h3 {
		margin: 0;
	}
	.collection {
		margin-bottom: 2rem;
	}
	.collection-details {
		margin-bottom: 1rem;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	button {
		width: fit-content;
	}
</style>
