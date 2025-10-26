<script lang="ts">
	import SectionLink from '$lib/components/layout/SectionLink.svelte';
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import { deleteCollection } from '$lib/remote-functions/collections.remote';
	import type { Mixtape, User } from '../../../../../../shared/types/core';
	import type { CollectionHydrated, TrackHydrated } from '../../../../../../shared/types/hydrated';
	import type { Session } from '@supabase/supabase-js';

	let {
		data
	}: {
		data: {
			collection: CollectionHydrated;
			session: Session;
			profileData: User;
			collections: CollectionHydrated[];
			likedTracks: TrackHydrated[];
			mixtapes: Mixtape[];
		};
	} = $props();

	let { id, name, description, releases } = $derived(data.collection);
</script>

<svelte:head>
	<title>{name} · Your collections · Soli</title>
	<meta name="description" content={`Browse the collection '${name}' on Soli.`} />
</svelte:head>

<SectionLink link="/me/collections" label="Your collections" />

<div class="collection">
	<div class="collection-details">
		<h2>{name}</h2>
		{#if description}
			<div>{description}</div>
		{/if}
	</div>
	<ReleaseCardGrid {releases} />
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
