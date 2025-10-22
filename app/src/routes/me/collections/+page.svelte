<script lang="ts">
	import { enhance } from '$app/forms';
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { data } = $props();

	const handleAddingCollection: SubmitFunction = () => {
		return async ({ update }) => {
			update();
		};
	};
</script>

<svelte:head>
	<title>Your Collections · Soli</title>
	<meta name="description" content="Browse your collections on Soli." />
</svelte:head>

<h2>Your collections</h2>

{#each data.collections as collection}
	<div class="collection">
		<div class="collection-details">
			<h3>{collection.name}</h3>
			{#if collection.description}
				<div>{collection.description}</div>
			{/if}
		</div>
		<ReleaseCardGrid releases={collection.releases} />
	</div>
{/each}

<h3>Create a new collection</h3>

<form method="post" action="/me/collections?/createCollection" use:enhance={handleAddingCollection}>
	<label for="collection-name">New Collection Name:</label>
	<input type="text" id="collection-name" name="collectionName" />
	<button type="submit" name="action" value="createCollection">Create Collection</button>
</form>

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
</style>
