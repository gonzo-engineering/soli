<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// const allArtists = data.songs.map((song) => song.artist);
	// const uniqueArtists = [...new Set(allArtists)];
</script>

<section>
	<a href="/releases"><h2>Releases</h2></a>

	<div class="releases-container">
		{#each data.releases as { id, name }}
			<a href={`/releases/${id}`}>
				<div class="release-square">
					{name}
				</div>
			</a>
			<!-- {#each data.songs.filter((song) => song.artist === artist) as song}
		<div>
			<h4>{song.name}</h4>
			<div>Release: {song.release}</div>
			<audio controls src={song.url}></audio>
		</div>
	{/each} -->
		{/each}
	</div>
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
	.release-square {
		width: 100px;
		height: 100px;
		border-radius: 10px;
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
</style>
