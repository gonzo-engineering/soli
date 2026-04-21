<script lang="ts">
	import GridWrapper from '$lib/components/GridWrapper.svelte';
	import BreadcrumbLinks from '$lib/components/layout/BreadcrumbLinks.svelte';
	import ReleaseCard from '$lib/components/ReleaseCard.svelte';
	import type { UserData } from '$lib/global/state.svelte';
	import { deleteCollection } from '$lib/remote-functions/collections.remote';
	import { makeImageLink } from '$lib/utils';
	import type { CollectionHydrated } from '../../../../../../shared/types/hydrated';

	let {
		data
	}: {
		data: UserData & {
			collection: CollectionHydrated;
		};
	} = $props();

	let { id, name, description, releases } = $derived(data.collection);
</script>

<svelte:head>
	<title>{name} · My collections · Soli</title>
	<meta name="description" content={`Browse the collection '${name}' on Soli.`} />
</svelte:head>

<BreadcrumbLinks
	breadcrumbs={[
		{ link: '/me', label: 'Me' },
		{ link: '/me/collections', label: 'My collections' }
	]}
/>

<div class="collection">
	<div class="collection-details">
		<h2>{name}</h2>
		{#if description}
			<div>{description}</div>
		{/if}
	</div>
	<GridWrapper gridItemSize="150px" gridGap="20px">
		{#each releases as release}
			<ReleaseCard
				link={`/releases/${release.id}`}
				name={release.title}
				artist={release.artist.name}
				coverArt={makeImageLink(release.artwork_ipfs_cid, 200)}
			/>
		{/each}
	</GridWrapper>
</div>

<form {...deleteCollection.for(id)}>
	<input {...deleteCollection.fields.collectionId.as('hidden', id)} />
	<button type="submit">Delete collection</button>
</form>

<style>
	h2 {
		margin-bottom: 0.5rem;
	}
	.collection {
		margin-bottom: 2rem;
	}
	.collection-details {
		margin-bottom: 2rem;
	}
</style>
