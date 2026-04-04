<script lang="ts">
	import ButtonWrapper from './ButtonWrapper.svelte';
	import { API_BASE } from '$lib/global/config';
	import { page } from '$app/state';
	import type { SearchResult } from '../../../../../shared/types/core';
	import SearchResults from '../search/SearchResults.svelte';
	import Icon from './Icon.svelte';
	import Logo from './Logo.svelte';
	import { onMount } from 'svelte';

	let {
		userIsLoggedIn,
		menuIsOpen = $bindable()
	}: {
		userIsLoggedIn: boolean;
		menuIsOpen: boolean;
	} = $props();

	let searchIsOpen = $state(false);
	let searchQuery = $state('');
	let searchResults: SearchResult[] = $state([]);
	let showPWAInstallPrompt = $state(false);
	let installPromptEvent: any | null = $state(null);

	const handleInstallClick = () => {
		if (installPromptEvent) {
			installPromptEvent.prompt();
			installPromptEvent.userChoice.then(() => {
				installPromptEvent = null;
				showPWAInstallPrompt = false;
			});
		}
	};

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			installPromptEvent = e;
			showPWAInstallPrompt = true;
		});
	});

	// Reset search when page changes
	$effect(() => {
		if (page.url) {
			searchIsOpen = false;
			searchQuery = '';
			searchResults = [];
		}
	});

	const performSearch = async (query: string) => {
		if (query.length < 3) {
			return;
		}
		try {
			const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
			if (response.ok) {
				const data = await response.json();
				searchResults = data.results;
			} else {
				console.error('Search request failed');
			}
		} catch (error) {
			console.error('Error performing search:', error);
		}
	};
</script>

{#if !userIsLoggedIn}
	<div class="closed-beta-message">
		Soli is in closed beta.
		<a href="/about">Learn more about what it's trying to achieve</a>
		and if you'd like to join,
		<a href="/contact">get in touch</a>
	</div>
{/if}

{#if showPWAInstallPrompt && userIsLoggedIn}
	<div class="install-prompt">
		Soli is available as a Progressive Web App! <ButtonWrapper
			label="Install Soli"
			onClickFunction={handleInstallClick}
		>
			<span class="install-button">Install</span>
		</ButtonWrapper> to your home screen for a better experience
	</div>
{/if}

<header>
	{#if userIsLoggedIn}
		<ButtonWrapper label="Search" onClickFunction={() => (searchIsOpen = !searchIsOpen)}>
			<Icon key="search" size={30} strokeMode />
		</ButtonWrapper>
	{:else}
		<div style="width: 30px;"></div>
	{/if}
	<a href="/">
		<Logo />
	</a>
	<ButtonWrapper
		label={menuIsOpen ? 'Close menu' : 'Open menu'}
		onClickFunction={() => (menuIsOpen = !menuIsOpen)}
	>
		{#if menuIsOpen}
			<Icon key="cross" size={30} strokeMode />
		{:else}
			<Icon key="menu" size={30} strokeMode />
		{/if}
	</ButtonWrapper>
</header>

{#if searchIsOpen}
	<div class="search-container">
		<input
			type="text"
			placeholder="Search for artists, releases, tracks..."
			bind:value={searchQuery}
			onkeydown={(e) => e.key === 'Enter' && performSearch(searchQuery)}
		/>
		<SearchResults {searchResults} query={searchQuery} />
	</div>
{/if}

<style>
	.closed-beta-message,
	.install-prompt {
		background-color: #edca4f;
		color: black;
		text-align: center;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
	}
	.closed-beta-message a {
		color: black;
		font-weight: bold;
		text-decoration: underline;
	}
	.install-button {
		background-color: black;
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		font-size: 0.875rem;
	}
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
</style>
