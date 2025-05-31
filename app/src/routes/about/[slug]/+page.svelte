<script lang="ts">
	import ContentBlock from '$lib/components/ContentBlock.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.pageTitle} · Soli</title>
	<meta name="description" content={data.pageDescription} />
</svelte:head>

<div class="main">
	<ContentBlock>
		<h2>{data.pageTitle}</h2>
		<data.pageContent />
	</ContentBlock>
</div>

<style>
	.main {
		margin: 2rem 0;
	}
</style>
