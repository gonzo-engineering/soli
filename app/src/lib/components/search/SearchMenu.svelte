<script lang="ts">
	import { API_BASE } from '$lib/global/config';
	import type { SearchResult } from '@soli/shared/types';
	import SearchResults from './SearchResults.svelte';

	let { searchIsOpen = $bindable() }: { searchIsOpen: boolean } = $props();

	let searchQuery = $state('');
	let submittedQuery: string | undefined = $state(undefined);
	let searchResults: SearchResult[] = $state([]);

	const browseOptions = [
		{ label: 'Artists', path: '/artists' },
		{ label: 'Releases', path: '/releases' },
		{ label: 'Genres', path: '/genres' },
		{ label: 'Labels', path: '/labels' }
	];

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
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				performSearch(searchQuery);
				submittedQuery = searchQuery;
			}
		}}
	/>
	{#if submittedQuery}
		<SearchResults {searchResults} query={submittedQuery} />
	{:else}
		<div class="browse-menu">
			<h3>Browse</h3>
			<div class="browse-cards">
				{#each browseOptions as option}
					<a href={option.path}
						><div class="browse-card">
							{option.label}
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}
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
	.browse-cards {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.browse-cards a {
		text-decoration: none;
		color: inherit;
		font-weight: 700;
	}
	.browse-card {
		font-size: 2rem;
		padding: 0.5rem;
		background-color: var(--color-background-secondary);
		box-shadow: var(--box-shadow);
		border-radius: 4px;
	}
</style>
