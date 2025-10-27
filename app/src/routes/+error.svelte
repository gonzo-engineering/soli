<script>
	import { page } from '$app/state';
</script>

<div class="error-message-container">
	<h2>{page.status}: {page.error?.message}</h2>

	<p>Something went wrong. Let's <a href="/">take it from the top</a>.</p>
</div>

<style>
	.error-message-container {
		text-align: center;
		margin: 5rem 0;
	}
</style>
