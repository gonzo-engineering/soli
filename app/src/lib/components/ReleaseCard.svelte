<script lang="ts">
	import ReleaseArtwork from './ReleaseArtwork.svelte';

	let {
		link,
		name,
		artist = undefined,
		coverArt
	}: {
		link: string;
		name: string;
		artist?: string;
		coverArt: string;
	} = $props();
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
	.artist-name {
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}
	a {
		text-decoration: none;
		color: inherit;
	}
</style>
