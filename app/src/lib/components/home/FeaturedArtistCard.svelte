<script lang="ts">
	import { makeImageLink } from '$lib/utils';
	import type { Artist } from '@soli/shared/types';

	const { artist }: { artist: Artist } = $props();
</script>

<a href={`/artists/${artist.id}`}>
	<div class="featured-artist-card">
		<img
			src={artist.image_ipfs_cid ? makeImageLink(artist.image_ipfs_cid, 1000) : ''}
			alt={artist.name}
		/>
		<h2>{artist.name}</h2>
	</div>
</a>

<style>
	a {
		text-decoration: none;
		color: inherit;
	}
	a:hover {
		opacity: 0.8;
	}
	.featured-artist-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: relative;
	}
	img {
		aspect-ratio: 1 / 1;
		object-fit: cover;
		border: 2px solid var(--color-accent);
		border-radius: 8px;
		background-color: var(--color-accent);
	}
	h2 {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		color: white;
		text-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
		margin: 0;
	}
	/* Table up */
	@media (min-width: 600px) {
		img {
			aspect-ratio: 16 / 9;
		}
	}
</style>
