<script lang="ts">
  import { enhance } from "$app/forms";
  import { makeImageLink } from "$lib/utils";
  import type { ArtistRaw } from "../../../../shared/types";

  let { activeArtist }: { activeArtist: ArtistRaw } = $props();
  let uploading = $state(false);

  function handleUpload() {
    uploading = true;
    return async ({ update }: { update: () => Promise<void> }) => {
      await update();
      uploading = false;
    };
  }
</script>

<div class="artist-profile">
  <h2>Profile</h2>
  <h3>{activeArtist.name}</h3>
  <form
    method="POST"
    enctype="multipart/form-data"
    action="?/updateArtistDetails"
    use:enhance={handleUpload}
  >
    <input type="hidden" name="artistID" value={activeArtist.id} />
    <input type="hidden" name="artistName" value={activeArtist.name} />
    {#if activeArtist.image_ipfs_cid}
      <img
        src={makeImageLink(activeArtist.image_ipfs_cid, 300)}
        alt={activeArtist.name}
      />
    {:else}
      <div>No profile image</div>
    {/if}
    <input
      type="hidden"
      name="existingImageCID"
      value={activeArtist.image_ipfs_cid}
    />
    <label for="file">Change profile image</label>
    <input
      type="file"
      id="file"
      name="artistImageNew"
      accept=".jpg,.jpeg,.png"
      required={false}
    />
    <label for="artistBio">Bio</label>
    <textarea name="artistBio" placeholder="Bio" required={false}>
      {activeArtist.bio}
    </textarea>
    <label for="artistWebsite">Website</label>
    <input
      type="text"
      name="artistWebsite"
      id="artistWebsite"
      placeholder="Website URL"
      value={activeArtist.website_url}
      required={false}
    />
    <button disabled={uploading} type="submit">
      {uploading ? "Updating..." : "Update profile"}
    </button>
  </form>
</div>

<style>
  .artist-profile {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    max-width: 600px;
  }
  img {
    max-width: 300px;
  }
</style>
