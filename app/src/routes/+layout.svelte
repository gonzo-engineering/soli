<script>
	import '$lib/styles/reset.css';
	import '$lib/styles/global.css';

	import { user } from '$lib/stores/userStore.svelte';
</script>

<svelte:head>
	<title>Soli</title>
</svelte:head>

<header>
	<a href="/"><img src="/soli-logo-full-white.png" class="icon" alt="Soli emblem" /></a>
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

{#if user.activeSong && user.activeSongArtist}
	<div class="audio-player">
		{user.activeSong.name} by
		<a href={`/artists/${user.activeSongArtist.artist.id}`}>{user.activeSongArtist.artist.name}</a>
		{#key user.activeSong.url}
			<audio controls autoplay controlsList="nodownload noplaybackrate">
				<source src={user.activeSong.url} type="audio/mpeg" />
				Your browser does not support the audio element.
			</audio>
		{/key}
	</div>
{/if}

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
	.strong {
		font-weight: 500;
	}
	.icon {
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
