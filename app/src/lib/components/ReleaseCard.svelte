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

	const randomRotation = Math.floor(Math.random() * 4) - 2;
</script>

<a href={link} style="--rotation: {randomRotation}deg">
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
		color: var(--color-text-secondary);
	}
	img {
		width: 100%;
		aspect-ratio: 1 / 1;
		margin-bottom: 0.5rem;
		box-shadow: var(--box-shadow);
		transform: rotate(var(--rotation));
		transition: transform 0.2s ease-in-out;
	}
	img:hover {
		@media (min-width: 600px) {
			transform: scale(1.05);
			transition: transform 0.2s ease-in-out;
		}
	}
	a {
		text-decoration: none;
		color: inherit;
	}
</style>
