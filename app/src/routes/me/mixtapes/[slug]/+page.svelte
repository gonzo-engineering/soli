<script lang="ts">
	import BreadcrumbLinks from '$lib/components/layout/BreadcrumbLinks.svelte';
	import TracksTable from '$lib/components/releases/TracksTable.svelte';
	import { deleteMixtape } from '$lib/remote-functions/mixtapes.remote';
	import type { Session } from '@supabase/supabase-js';
	import type { Mixtape, User } from '../../../../../../shared/types/core';
	import type {
		CollectionHydrated,
		MixtapeHydrated,
		TrackHydrated
	} from '../../../../../../shared/types/hydrated';

	let {
		data
	}: {
		data: {
			mixtape: MixtapeHydrated;
			session: Session;
			profileData: User;
			collections: CollectionHydrated[];
			likedTracks: TrackHydrated[];
			mixtapes: Mixtape[];
		};
	} = $props();

	let { id, name, description, tracks } = $derived(data.mixtape);
</script>

<svelte:head>
	<title>{name} · Your mixtapes · Soli</title>
	<meta name="description" content={`Browse the mixtape "${name}" on Soli.`} />
</svelte:head>

<BreadcrumbLinks
	breadcrumbs={[
		{ link: '/me', label: 'Me' },
		{ link: '/me/mixtapes', label: 'My mixtapes' }
	]}
/>

<div class="mixtape">
	<div class="mixtape-details">
		<h2>{name}</h2>
		{#if description}
			<div>{description}</div>
		{/if}
	</div>
	<TracksTable {tracks} showReleaseAndArtist />
</div>

<form {...deleteMixtape.for(id)}>
	<input {...deleteMixtape.fields.mixtapeId.as('hidden', id)} />
	<button type="submit">Delete mixtape</button>
</form>

<style>
	h2 {
		margin-bottom: 0.5rem;
	}
	.mixtape {
		margin-bottom: 2rem;
	}
	.mixtape-details {
		margin-bottom: 1rem;
	}
</style>
