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
  <div>
    <div><strong>Name:</strong> {activeArtist.name}</div>
    <div><strong>Bio:</strong> {activeArtist.bio}</div>
    <div>
      <strong>Website:</strong>
      <a
        href={activeArtist.website_url}
        target="_blank"
        rel="noopener noreferrer">{activeArtist.website_url}</a
      >
    </div>
  </div>
  <button
    class="edit-button"
    onclick={() => {
      // Logic to handle editing the profile
      console.log("Edit profile clicked");
    }}
  >
    Edit profile details
  </button>
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
