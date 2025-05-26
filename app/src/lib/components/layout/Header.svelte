<script lang="ts">
	import Menu from '../icons/Menu.svelte';
	import Search from '../icons/Search.svelte';
	import ButtonWrapper from './ButtonWrapper.svelte';

	let menuIsOpen = $state(false);
	let searchIsOpen = $state(false);
</script>

<header>
	<ButtonWrapper onClickFunction={() => (searchIsOpen = !searchIsOpen)}>
		<Search />
	</ButtonWrapper>
	<a href="/">
		<img src="/full-logo-white.png" class="icon dark" alt="Soli emblem" />
		<img src="/full-logo-black.png" class="icon light" alt="Soli emblem" />
	</a>
	<ButtonWrapper onClickFunction={() => (menuIsOpen = !menuIsOpen)}>
		<Menu />
	</ButtonWrapper>
</header>

{#if menuIsOpen}
	<nav class="menu">
		<ul>
			<li><a href="/about">Playlists</a></li>
			<li><a href="/">Collections</a></li>
			<li><a href="/account">Account</a></li>
		</ul>
	</nav>
{/if}

{#if searchIsOpen}
	<div class="search-container">
		<input type="text" placeholder="Search..." />
	</div>
{/if}

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 1rem;
		max-height: 60px;
		a {
			text-decoration: none;
			color: inherit;
		}
	}
	.icon {
		height: 50px;
	}
	input {
		width: 90%;
		max-width: 400px;
		padding: 0.5rem;
		margin: 0 1rem;
		border: 1px solid var(--color-accent);
		border-radius: 4px;
		font-size: 1rem;
	}
	.search-container {
		width: 100%;
	}
	@media (min-width: 600px) {
		.icon:hover {
			opacity: 0.8;
		}
	}
	.dark {
		display: none;
	}
	@media (prefers-color-scheme: dark) {
		.dark {
			display: block;
		}
		.light {
			display: none;
		}
	}
</style>
