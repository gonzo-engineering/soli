<script lang="ts">
  import { enhance } from "$app/forms";
  import type { GroupListResponse } from "pinata";
  import type { ArtistRaw, TrackRaw } from "../../../shared/types";

  let {
    form,
    data,
  }: {
    form: any;
    data: {
      groups: GroupListResponse;
      artists: ArtistRaw[];
      songs: TrackRaw[];
    };
  } = $props();

  let uploading = $state(false);

  function handleUpload() {
    uploading = true;
    return async ({ update }: { update: () => Promise<void> }) => {
      await update();
      uploading = false;
    };
  }
</script>

<svelte:head>
  <title>Booth · Soli</title>
  <meta name="description" content="Upload and manage your music." />
</svelte:head>

<div class="dashboard">
  <div class="artists-list">
    <h2>Artists</h2>
    {#each data.artists as artist}
      <div class="file">
        <h3>{artist.name}</h3>
        <div>Supabase UUID: {artist.id}</div>
        <div>Pinata group ID: {artist.pinata_group_id ?? "n/a"}</div>
      </div>
    {/each}
  </div>
  <div class="songs-list">
    <h2>Songs</h2>
    {#each data.songs as song}
      <div class="file">
        <h3>{song.title}</h3>
        <div>Supabase UUID: {song.id}</div>
        <div>Pinata CID: {song.ipfs_cid}</div>
      </div>
    {/each}
  </div>
  <div class="upload-form">
    <h2>Upload a song</h2>
    <form
      method="POST"
      enctype="multipart/form-data"
      use:enhance={handleUpload}
    >
      <input type="file" id="file" name="fileToUpload" accept=".mp3" />
      <label for="file">Choose an MP3 file</label>
      <input type="text" name="title" placeholder="Title" required />
      <input
        type="text"
        name="artistGroup"
        placeholder="Artist's Pinata group ID"
        required
      />
      <button disabled={uploading} type="submit">
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </form>
    {#if form && form.status === 200}
      <p>File uploaded successfully!</p>
    {/if}
  </div>
</div>

<style>
  .dashboard {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    padding: 2rem;
  }
  .upload-form {
    text-align: center;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 300px;
    margin: auto;
  }
  .artists-list,
  .songs-list {
    max-width: 500px;
  }
  .file {
    border: 1px solid #ccc;
    padding: 1rem;
    margin: 0.5rem 0;
  }
</style>
