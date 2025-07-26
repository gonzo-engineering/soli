<script lang="ts">
  import { makeImageLink } from "$lib/utils";
  import type { ArtistRaw } from "../../../../shared/types";

  let { activeArtist }: { activeArtist: ArtistRaw } = $props();
</script>

<div class="artist-profile">
  <h2>Profile</h2>
  {#if activeArtist.image_ipfs_cid}
    <img
      src={makeImageLink(activeArtist.image_ipfs_cid, 300)}
      alt={activeArtist.name}
    />
  {:else}
    <div>No profile image</div>
  {/if}
  <div>Name: {activeArtist.name}</div>
  <div>Bio: {activeArtist.bio}</div>
  <div>
    Website: <a
      href={activeArtist.website_url}
      target="_blank"
      rel="noopener noreferrer">{activeArtist.website_url}</a
    >
  </div>
  <div>
    Created At: {new Date(activeArtist.created_at).toLocaleDateString()}
  </div>
</div>

<style>
  .artist-profile {
    width: 100%;
  }
</style>
