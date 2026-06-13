<script lang="ts">
	import type { Artist } from '@soli/shared/types/core';
	import ArtistProfileForm from '../../forms/ArtistProfileForm.svelte';

	let { activeArtist }: { activeArtist: Artist } = $props();
</script>

<div class="artist-profile">
	<h2>Profile</h2>
	<h3>{activeArtist.name}</h3>
	<ArtistProfileForm
		artistId={activeArtist.id}
		artistName={activeArtist.name}
		currentArtistImageCID={activeArtist.image_ipfs_cid}
		artistBio={activeArtist.bio}
		artistWebsite={activeArtist.website_url}
	/>
</div>

<style>
	.artist-profile {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}
</style>
