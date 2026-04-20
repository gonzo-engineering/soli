<script lang="ts">
	import { makeImageLink } from '$lib/utils';
	import BreadcrumbLinks from '$lib/components/layout/BreadcrumbLinks.svelte';
	import type { Artist, Label, Release } from '../../../../../shared/types/core';
	import type { UserData } from '$lib/global/state.svelte';
	import GridWrapper from '$lib/components/GridWrapper.svelte';
	import CircleCard from '$lib/components/CircleCard.svelte';

	let {
		data
	}: {
		data: UserData & {
			label: Label;
			artists: Artist[];
		};
	} = $props();

	const { name, website_url, image_cid } = $derived(data.label);
</script>

<svelte:head>
	<title>{name} · Labels · Soli</title>
	<meta name="description" content={`The label page for ${name}.`} />
</svelte:head>

<BreadcrumbLinks breadcrumbs={[{ link: '/labels', label: 'Labels' }]} />

<h2>{name}</h2>

{#if data.label.website_url}
	<a href={website_url}>{website_url?.replace('https://', '').replaceAll('/', '')}</a>
{/if}

{#if image_cid}
	<img class="label-image" src={makeImageLink(image_cid, 500)} alt={`Image of ${name}`} />
{/if}

{#if data.label.description}
	<p>{data.label.description}</p>
{/if}

<h3>Artists on this label</h3>

<GridWrapper>
	{#each data.artists as artist}
		<CircleCard
			name={artist.name}
			image={artist.image_ipfs_cid
				? makeImageLink(artist.image_ipfs_cid, 200)
				: '/placeholder-artist.png'}
			link={`/artists/${artist.id}`}
		/>
	{/each}
</GridWrapper>

<style>
	h2 {
		margin-bottom: 0.25rem;
	}
	.label-image {
		width: 100%;
		max-width: 500px;
		border-radius: 8px;
		margin: 1rem 0;
		border: 2px solid lightgray;
	}
</style>
