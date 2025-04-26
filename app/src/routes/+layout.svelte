<script>
	import '$lib/styles/reset.css';
	import '$lib/styles/global.css';

	import { user } from '$lib/stores/userStore.svelte';
</script>

<svelte:head>
	<title>Soli</title>
</svelte:head>

<header>
	<a href="/"><img src="/emblem-white.png" class="icon" alt="Soli emblem" /></a>
	<a href="/"><h1>oli</h1></a>
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

<div class="audio-player">
	{#if user.activeSong && user.activeSongArtist}
		{user.activeSong.name} by
		<a href={`/artists/${user.activeSongArtist.id}`}>{user.activeSongArtist.name}</a>
		{#key user.activeSong.url}
			<audio controls autoplay>
				<source src={user.activeSong.url} type="audio/mpeg" />
				Your browser does not support the audio element.
			</audio>
		{/key}
	{:else}
		Silence...
	{/if}
</div>

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
		color: white;
		font-family: 'Cherry Bomb One', system-ui;
		font-size: 2.8rem;
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
	.audio-player {
		text-align: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		color: #333;
		background-color: #f0f0f0;
		padding: 1rem;
		a {
			color: black;
		}
	}
</style>
