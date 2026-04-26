<script lang="ts">
	import { page } from '$app/state';
	import { API_BASE } from '$lib/global/config';
	import type { SearchResult } from '../../../../../shared/types/core';
	import SearchResults from './SearchResults.svelte';

	let { searchIsOpen = $bindable() }: { searchIsOpen: boolean } = $props();

	let searchQuery = $state('');
	let searchResults: SearchResult[] = $state([]);

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
	<h2>Search</h2>
	<input
		type="text"
		placeholder="Find artists and releases..."
		bind:value={searchQuery}
		onkeydown={(e) => e.key === 'Enter' && performSearch(searchQuery)}
	/>
	<SearchResults {searchResults} query={searchQuery} />
</div>

<style>
	h2 {
		margin-bottom: 0;
	}
	.search-container {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		gap: 1rem;
	}
	input {
		max-width: 800px;
		padding: 0.5rem;
		border: 1px solid var(--color-accent);
		border-radius: 4px;
		font-size: 1rem;
	}
</style>
