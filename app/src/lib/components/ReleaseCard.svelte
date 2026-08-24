<script lang="ts">
	import ReleaseArtwork from './ReleaseArtwork.svelte';

	let {
		link,
		name,
		coverArt,
		artist = undefined,
		releaseDate = undefined
	}: {
		link: string;
		name: string;
		coverArt: string;
		artist?: string;
		releaseDate?: string;
	} = $props();

	const releaseUpcoming = $derived(
		releaseDate ? new Date(releaseDate) > new Date() : false
	);
</script>

<a href={link}>
	<div class="release-card">
		<ReleaseArtwork {name} {artist} imageSrc={coverArt} isAskew growsOnHover />
		<div class="release-name">{name}</div>
		{#if artist}
			<div class="artist-name">
				{artist}
			</div>
		{/if}
		{#if releaseUpcoming && releaseDate}
			<div class="release-date">
				Out {new Date(releaseDate).toLocaleDateString(undefined, {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
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
		margin-top: 0.5rem;
		font-weight: 500;
	}
	.release-date {
		font-size: 0.8rem;
		font-weight: 500;
		color: black;
		background-color: var(--color-soli-yellow);
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		width: fit-content;
		margin-top: 0.5rem;
	}
	.artist-name {
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}
	a {
		text-decoration: none;
		color: inherit;
	}
</style>
