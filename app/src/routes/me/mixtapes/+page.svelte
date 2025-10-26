<script lang="ts">
	import { makeMixtape } from '$lib/remote-functions/mixtapes.remote';

	let { data } = $props();

	const mixtapes = $derived(data.mixtapes);
</script>

<svelte:head>
	<title>Your mixtapes · Soli</title>
	<meta name="description" content="Browse your mixtapes on Soli." />
</svelte:head>

<section>
	<h2>Your mixtapes</h2>

	{#each mixtapes as mixtape}
		<a href="/me/mixtapes/{mixtape.id}">
			<div class="mixtape-details">
				<h3>{mixtape.name}</h3>
				{#if mixtape.description}
					<div>{mixtape.description}</div>
				{/if}
				<div>{mixtape.tracks.length} track{mixtape.tracks.length !== 1 ? 's' : ''}</div>
			</div>
		</a>
	{/each}
</section>

<section>
	<h2>Create a new mixtape</h2>

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
</section>

<style>
	section {
		margin-bottom: 2rem;
	}
	h3 {
		margin: 0;
	}
	.mixtape-details {
		margin-bottom: 1rem;
		padding: 1rem;
		border: 1px solid #eee;
		border-radius: 0.5rem;
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
