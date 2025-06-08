<script lang="ts">
  import { enhance } from "$app/forms";
  import type { GroupListResponse } from "pinata";
  import type {
    ArtistRaw,
    ReleaseHydrated,
    ReleaseRaw,
    TrackRaw,
  } from "../../../shared/types";
  import { makeImageLink } from "$lib/utils";
  import { formatReleaseType } from "../../../shared/utils";

  let {
    form,
    data,
  }: {
    form: any;
    data: {
      groups: GroupListResponse;
      artists: ArtistRaw[];
      songs: TrackRaw[];
      releasesRaw: ReleaseRaw[];
      releasesHydrated: ReleaseHydrated[];
    };
  } = $props();

  let uploading = $state(false);
  let activeArtist: ArtistRaw | null = $state(null);
  let activeArtistSongs = $derived(
    data.songs.filter((song) => song.artist_id === activeArtist?.id)
  );
  let activeArtistReleasesRaw = $derived(
    data.releasesRaw.filter((release) => release.artist_id === activeArtist?.id)
  );
  let activeArtistReleasesHydrated = $derived(
    data.releasesHydrated.filter(
      (release) => release.artist_id === activeArtist?.id
    )
  );

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

<div class="artist-selector">
  <h2>
    Active artist: <select
      bind:value={activeArtist}
      onchange={() => {
        activeArtistSongs = data.songs.filter(
          (song) => song.artist_id === activeArtist?.id
        );
        activeArtistReleasesHydrated = data.releasesHydrated.filter(
          (release) => release.artist_id === activeArtist?.id
        );
      }}
    >
      <option value={null}>Select an artist</option>
      {#each data.artists as artist}
        <option value={artist}>{artist.name}</option>
      {/each}
    </select>
  </h2>
</div>

<div class="dashboard">
  {#if activeArtist}
    <div class="releases-list">
      <h2>
        Releases ({activeArtistReleasesHydrated.length})
      </h2>
      {#each activeArtistReleasesHydrated as release}
        <div class="card release-card">
          <div>
            <img
              class="cover-artwork"
              src={makeImageLink(release.artwork_ipfs_cid, 100)}
              alt=""
            />
          </div>

          <div>
            <h3>{release.title}</h3>
            <div><b>Type</b>: {formatReleaseType(release.release_type)}</div>
            <div><b>Release date</b>: {release.release_date}</div>
            <div><b>Track</b>:</div>
            <ol>
              {#each release.tracks as track}
                <li>
                  {track.title}
                </li>
              {/each}
            </ol>
          </div>
        </div>
      {/each}
    </div>
    <div class="songs-list">
      <h2>
        Songs ({activeArtistSongs.length})
      </h2>
      {#each activeArtistSongs as song}
        <div class="card">
          <h3>{song.title}</h3>
        </div>
      {/each}
    </div>
  {/if}
  {#if activeArtist}
    <div class="forms">
      <div class="upload-form">
        <h2>Upload a song</h2>
        <form
          method="POST"
          enctype="multipart/form-data"
          action="?/uploadTrack"
          use:enhance={handleUpload}
        >
          <input type="file" id="file" name="fileToUpload" accept=".mp3" />
          <label for="file">Choose an MP3 file</label>
          <input type="text" name="title" placeholder="Title" required />
          <input
            type="text"
            name="artistName"
            value={activeArtist.name}
            class="hidden"
            required
          />
          <input
            type="text"
            name="artistID"
            value={activeArtist.id}
            class="hidden"
            required
          />
          <input
            type="text"
            name="artistGroup"
            value={activeArtist.pinata_group_id}
            class="hidden"
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
      <div class="add-release-form">
        <h2>Add a release</h2>
        <form
          method="POST"
          action="?/addRelease"
          enctype="multipart/form-data"
          use:enhance={handleUpload}
        >
          <input
            type="file"
            id="releaseArtwork"
            name="releaseArtwork"
            accept=".jpg,.jpeg,.png"
          />
          <label for="releaseArtwork">Choose release artwork</label>
          <input
            type="text"
            name="releaseTitle"
            placeholder="Release Title"
            required
          />
          <select name="releaseType" required>
            <option value="" disabled selected>Select release type</option>
            <option value="album">album</option>
            <option value="single">single</option>
            <option value="ep">ep</option>
          </select>
          <input
            type="text"
            name="artistID"
            value={activeArtist.id}
            class="hidden"
            required
          />
          <input
            type="date"
            name="releaseDate"
            placeholder="Release Date"
            required
          />
          <input
            type="text"
            name="releaseTags"
            placeholder="Tags (comma-separated)"
            required
          />
          <button disabled={uploading} type="submit">
            {uploading ? "Adding..." : "Add Release"}
          </button>
        </form>
        {#if form && form.status === 200}
          <p>Release added successfully!</p>
        {/if}
      </div>
      <div class="add-track-to-release-form">
        <h2>Add a track to release</h2>
        <form
          method="POST"
          action="?/addTrackToRelease"
          use:enhance={handleUpload}
        >
          <select name="releaseID" required>
            <option value="" disabled selected>Select a release</option>
            {#each activeArtistReleasesRaw as release}
              <option value={release.id}>{release.title}</option>
            {/each}
          </select>
          <select name="trackID" required>
            <option value="" disabled selected>Select a track</option>
            {#each activeArtistSongs as song}
              <option value={song.id}>{song.title}</option>
            {/each}
          </select>
          <input
            type="number"
            name="trackNumber"
            placeholder="Track Number"
            min="1"
            required
          />
          <button disabled={uploading} type="submit">
            {uploading ? "Adding..." : "Add Track"}
          </button>
        </form>
        {#if form && form.status === 200}
          <p>Track added to release successfully!</p>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .artist-selector {
    margin-bottom: 1rem;
  }
  .dashboard {
    display: flex;
    flex-direction: row;
    gap: 2rem;
  }
  .forms {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    flex: 1;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 300px;
  }
  .hidden {
    display: none;
  }
  .releases-list,
  .songs-list {
    min-width: 300px;
    max-width: 500px;
    flex: 1;
  }
  .card {
    border: 1px solid #ccc;
    padding: 1rem;
    margin: 0.5rem 0;
    /* cursor: pointer; */
    border-radius: 5px;
  }
  .release-card {
    display: flex;
    gap: 1rem;
  }
  .cover-artwork {
    aspect-ratio: 1 / 1;
  }
</style>
