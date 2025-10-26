<script lang="ts">
	import SectionLink from '$lib/components/layout/SectionLink.svelte';
	import TracksTable from '$lib/components/releases/TracksTable.svelte';
	import { deleteMixtape, getMixtape } from '$lib/remote-functions/mixtapes.remote';

	let { params } = $props();

	let mixtapePromise = $derived(getMixtape(params.slug));
	let { id, name, description, tracks } = $derived(await mixtapePromise);
</script>

<svelte:head>
	<title>{name} · Your mixtapes · Soli</title>
	<meta name="description" content={`Browse the mixtape "${name}" on Soli.`} />
</svelte:head>

<SectionLink link="/me/mixtapes" label="Your mixtapes" />

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
	<input {...deleteMixtape.fields.mixtapeId.as('hidden')} value={id} />
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
