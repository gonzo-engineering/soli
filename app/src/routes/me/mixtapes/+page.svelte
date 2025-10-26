<script lang="ts">
	import { makeMixtape } from '$lib/remote-functions/mixtapes.remote';

	let { data } = $props();

	const mixtapes = data.mixtapes;
</script>

<svelte:head>
	<title>Your mixtapes · Soli</title>
	<meta name="description" content="Browse your mixtapes on Soli." />
</svelte:head>

<h2>Your mixtapes</h2>

{#each mixtapes as mixtape}
	<div class="mixtape">
		<div class="mixtape-details">
			<a href="/me/mixtapes/{mixtape.id}">{mixtape.name}</a>
		</div>
	</div>
{/each}

{#if data.user}
	<h3>Create a new mixtape</h3>

	<form {...makeMixtape}>
		<label>
			Name
			<input {...makeMixtape.fields.name.as('text')} />
		</label>
		<label>
			Description
			<input {...makeMixtape.fields.description.as('text')} />
		</label>
		<button type="submit">Create</button>
	</form>
{/if}

<style>
	h3 {
		margin: 0;
	}
</style>
