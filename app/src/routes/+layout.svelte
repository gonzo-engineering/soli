<script>
	import '$lib/styles/reset.css';
	import '$lib/styles/global.css';
</script>

<svelte:head>
	<title>Soli</title>
</svelte:head>

<header>
	<a href="/"><img src="/emblem-white.png" class="icon" alt="Soli emblem" /></a>

	<!-- <a href="/"><h1>Soli</h1></a> -->
</header>

<main>
	<slot />
</main>

<footer>
	<ul>
		<li>
			<a href="/about">About</a>
		</li>
		<li>
			<a href="/contact">Contact</a>
		</li>
	</ul>
	<div>
		Powered by <a href="https://gonzo.engineering"><span class="strong">Gonzo Engineering</span></a>
	</div>
</footer>

<style>
	header,
	footer {
		text-align: center;
		margin: 1rem 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		max-height: 100px;
	}
	header a,
	footer a {
		text-decoration: none;
		color: inherit;
	}
	footer {
		gap: 1rem;
	}
	h1 {
		font-size: 4rem;
		font-weight: 700;
	}
	.strong {
		font-weight: 500;
	}
	.icon {
		width: 50px;
		height: 50px;
	}
	footer {
		flex-direction: column;
	}
	footer ul {
		list-style: none;
		display: flex;
		gap: 1rem;
		padding: 0;
		margin: 0;
	}

	@media (max-width: 600px) {
		main {
			margin: 0 1rem;
		}
	}
</style>
