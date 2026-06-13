<script lang="ts">
	import BreadcrumbLinks from '$lib/components/layout/BreadcrumbLinks.svelte';
	import { makeCollection } from '$lib/remote-functions/collections.remote';
	import type { CollectionHydrated } from '@soli/shared/types';

	let { data } = $props();

	const collections: CollectionHydrated[] = $derived(data.collections);
</script>

<svelte:head>
	<title>My collections · Soli</title>
	<meta name="description" content="Browse my collections on Soli." />
</svelte:head>

<BreadcrumbLinks breadcrumbs={[{ link: '/me', label: 'Me' }]} />

<section>
	<h2>My collections</h2>

	{#each collections as collection}
		<a href="/me/collections/{collection.id}">
			<div class="collection-details">
				<h3>{collection.name}</h3>
				{#if collection.description}
					<div>{collection.description}</div>
				{/if}
				<div>{collection.releases.length} release{collection.releases.length !== 1 ? 's' : ''}</div>
			</div>
		</a>
	{/each}
</section>

<section>
	{#if data.user}
		<h2>Create a new collection</h2>

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
</section>

<style>
	h3 {
		margin: 0;
	}
	section {
		margin-bottom: 2rem;
	}
	.collection-details {
		margin-bottom: 1rem;
		padding: 1rem;
		background-color: var(--color-background-secondary);
		box-shadow: var(--box-shadow);
		border-radius: 0.5rem;
		max-width: 600px;
	}
	a {
		text-decoration: none;
		color: inherit;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1rem;
		max-width: 400px;
	}
	input,
	button {
		width: 100%;
	}
</style>
