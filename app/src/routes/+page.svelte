<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const allArtists = data.songs.map((song) => song.artist);
	const uniqueArtists = [...new Set(allArtists)];
</script>

<h2>Releases</h2>

{#each uniqueArtists as artist}
	<h3>{artist}</h3>
	{#each data.songs.filter((song) => song.artist === artist) as song}
		<div>
			<h4>{song.name}</h4>
			<div>Release: {song.release}</div>
			<audio controls src={song.url}></audio>
		</div>
	{/each}
{/each}

<h2>Artists</h2>
{#each uniqueArtists as artist}
	<div class="artist-circle">
		<h3>{artist}</h3>
	</div>
{/each}

<style>
	.artist-circle {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background-color: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 10px;
		text-align: center;
		color: black;
	}
</style>
