<script lang="ts">
	import ReleaseCardGrid from '$lib/components/ReleaseCardGrid.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<section>
	<a href="/releases"><h2>Releases</h2></a>

	<ReleaseCardGrid releases={data.releases} />
</section>

<section>
	<a href="/artists"><h2>Artists</h2></a>

	<div class="artists-container">
		{#each data.artists as { id, name }}
			<a href={`/artists/${id}`}>
				<div class="artist-circle">
					{name}
				</div>
			</a>
		{/each}
	</div>
</section>

<style>
	section {
		margin-bottom: 2rem;
	}
	.releases-container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
	.artist-circle {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background-color: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: black;
	}
	.artists-container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
