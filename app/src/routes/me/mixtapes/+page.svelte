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
			<h3>{mixtape.name}</h3>
			{#if mixtape.description}
				<div>{mixtape.description}</div>
			{/if}
			{#if mixtape.tracks.length > 0}
				{#each mixtape.tracks as track, i}
					<div>
						{i + 1}. {track.title} by <a href="/artists/{track.artist.id}">{track.artist.name}</a>
					</div>
				{/each}
			{:else}
				<div>This mixtape has no tracks yet.</div>
			{/if}
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
	.mixtape {
		margin-bottom: 2rem;
	}
	.mixtape-details {
		margin-bottom: 1rem;
	}
</style>
