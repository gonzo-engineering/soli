<script lang="ts">
	import { page } from '$app/state';
	import { API_BASE } from '$lib/global/config';
	import type { SearchResult } from '../../../../../shared/types/core';
	import SearchResults from './SearchResults.svelte';

	let { searchIsOpen = $bindable() }: { searchIsOpen: boolean } = $props();

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

<div class="search-container">
	<input
		type="text"
		placeholder="Search for artists, releases, tracks..."
		bind:value={searchQuery}
		onkeydown={(e) => e.key === 'Enter' && performSearch(searchQuery)}
	/>
	<SearchResults {searchResults} query={searchQuery} />
</div>

<style>
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
		height: 100%;
	}
</style>
