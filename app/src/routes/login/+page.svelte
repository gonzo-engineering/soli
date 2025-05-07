<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types.js';

	export let form: ActionData;

	let loading = false;

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			update();
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>Login • Soli</title>
</svelte:head>

<form method="POST" use:enhance={handleSubmit}>
	<div class="wrapper">
		<h2>Log in</h2>
		<div class="description">
			If you're part of the experiment, you can sign in via magic link with your email below.
		</div>
		{#if form?.message !== undefined}
			<div class="success {form?.success ? '' : 'fail'}">
				{form?.message}
			</div>
		{/if}
		<div>
			<input
				id="email"
				name="email"
				type="email"
				placeholder="Your email"
				value={form?.email ?? ''}
			/>
		</div>
		{#if form?.errors?.email}
			<span>
				{form?.errors?.email}
			</span>
		{/if}
		<div>
			<button>
				{loading ? 'Loading' : 'Send magic link'}
			</button>
		</div>
	</div>
</form>

<style>
	.wrapper {
		max-width: 400px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	h2 {
		margin: 0;
		line-height: 1;
	}
	.description {
		line-height: 1.3;
		margin-bottom: 0;
	}
	input,
	button {
		border-radius: 0.5rem;
		padding: 0 0.5rem;
	}
</style>
