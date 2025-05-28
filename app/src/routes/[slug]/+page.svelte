<script lang="ts">
	import ContentBlock from '$lib/components/ContentBlock.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.pageTitle} · Soli</title>
	<meta name="description" content={data.pageDescription} />
</svelte:head>

<ContentBlock>
	<h2>{data.pageTitle}</h2>
	<data.pageContent />
</ContentBlock>
