<script>
	import ContentBlock from '$lib/components/ContentBlock.svelte';
</script>

<svelte:head>
	<title>About · Soli</title>
	<meta name="description" content="Music streaming that doesn't fuck musicians." />
</svelte:head>

<ContentBlock>
	<h2>About</h2>
	<p><span class="strong">Soli</span> is a thought experiment.</p>
	<p>
		The thought: <span class="strong"
			>What might music streaming look like if it was built in service of musicians rather than to
			exploit them?</span
		>
	</p>
	<p>
		This is the experiment bit - a prototype of an <a
			href="https://github.com/gonzo-engineering/soli">open source</a
		> and decentralised music streaming network with fair, transparent remuneration.
	</p>
	<p>How hard can it be?</p>
</ContentBlock>

<style>
	a {
		font-weight: 500;
	}
</style>
