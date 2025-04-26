<script lang="ts">
	let {
		link,
		name,
		artist,
		coverArt,
		hideArtist = false
	}: {
		link: string;
		name: string;
		artist: string;
		coverArt: string;
		hideArtist?: boolean;
	} = $props();
</script>

<a href={link}>
	<div class="release-card">
		<img src={coverArt} alt={`Artwork for ${name} by ${artist}`} />
		<div class="release-name">{name}</div>
		{#if !hideArtist}
			<div class="artist-name">
				{artist}
			</div>
		{/if}
	</div>
</a>

<style>
	.release-card {
		max-width: 200px;
		line-height: 1.2;
	}
	.release-name {
		font-weight: 500;
	}
	.artist-name {
		font-size: 0.8rem;
		color: lightgray;
	}
	img {
		aspect-ratio: 1;
		width: 100px;
		height: 100px;
		border-radius: 10px;
		margin-bottom: 0.5rem;
		border: solid 2px lightgray;
	}
	a {
		text-decoration: none;
		color: inherit;
	}
</style>
