<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Error {page.status} · Soli</title>
</svelte:head>

<div class="error-message-container">
	<h2>{page.status}: {page.error?.message}</h2>

	<p>Looks like we lost the beat. Let's <a href="/">take it from the top</a>.</p>
</div>

<style>
	.error-message-container {
		text-align: center;
		margin: 30vh 0;
	}
</style>
