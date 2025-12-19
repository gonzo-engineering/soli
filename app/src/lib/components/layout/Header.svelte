<script lang="ts">
	import ButtonWrapper from './ButtonWrapper.svelte';
	import { API_BASE } from '$lib/global/config';
	import { page } from '$app/state';
	import type { SearchResult } from '../../../../../shared/types/core';
	import SearchResults from '../search/SearchResults.svelte';
	import Icon from './Icon.svelte';

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

<header>
	{#if userIsLoggedIn}
		<ButtonWrapper onClickFunction={() => (searchIsOpen = !searchIsOpen)}>
			<Icon key="search" size={30} strokeMode />
		</ButtonWrapper>
	{:else}
		<div style="width: 30px;"></div>
	{/if}
	<a href="/">
		<img src="/full-logo-white.png" class="icon dark" alt="Soli emblem" />
		<img src="/full-logo-black.png" class="icon light" alt="Soli emblem" />
	</a>
	<ButtonWrapper onClickFunction={() => (menuIsOpen = !menuIsOpen)}>
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
