<script lang="ts">
  import { enhance } from "$app/forms";
  import type { GroupListResponse } from "pinata";
  import type {
    ArtistRaw,
    ReleaseHydrated,
    ReleaseRaw,
    StreamLog,
    TrackRaw,
  } from "../../../shared/types";
  import { dashboardState } from "$lib/state.svelte";
  import Card from "$lib/components/Card.svelte";
  import ReleaseInfo from "$lib/components/ReleaseInfo.svelte";
  import { PUBLIC_GATEWAY_URL } from "$env/static/public";
  import ProfileSummary from "$lib/components/ProfileSummary.svelte";
  import { prettifyDuration } from "../../../shared/utils";

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
      streams: StreamLog[];
    };
  } = $props();

  let uploading = $state(false);
  let activeArtist: ArtistRaw | null = $derived(dashboardState.activeArtist);
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
  let activeArtistStreams = $derived(
    data.streams.filter((stream) => stream.artist_id === activeArtist?.id)
  );

  const calculateAveragePayout = (streams: StreamLog[]) => {
    const total = streams.reduce((acc, stream) => acc + stream.tokens_used, 0);
    return total / streams.length || 0;
  };

  const calculateTotalEarnings = (
    streams: StreamLog[],
    outputFormat: "readable-string" | "raw"
  ) => {
    const total = streams.reduce((acc, stream) => acc + stream.tokens_used, 0);
    return outputFormat === "readable-string"
      ? `£${(total / 100).toFixed(2)}`
      : total / 100;
  };

  function handleUpload() {
    uploading = true;
    return async ({ update }: { update: () => Promise<void> }) => {
      await update();
      uploading = false;
    };
  }

  export const makeImageLink = (cid: string, width: number) => {
    return `https://${PUBLIC_GATEWAY_URL}/ipfs/${cid}?img-width=${width}`;
  };
</script>

<svelte:head>
  <title>Dashboard · Soli</title>
  <meta name="description" content="Upload and manage your music." />
</svelte:head>

<div>
  {#if activeArtist}
    {#if dashboardState.activeSection === "music"}
      <div class="dashboard">
        <div class="releases-list">
          <h2>
            Releases ({activeArtistReleasesHydrated.length})
          </h2>
          {#each activeArtistReleasesHydrated as release}
            <Card>
              <ReleaseInfo {release} />
            </Card>
          {/each}
        </div>
        <div class="songs-list">
          <h2>
            Songs ({activeArtistSongs.length})
          </h2>
          {#each activeArtistSongs as song}
            <Card>
              <div class="song-wrapper">
                <div>{song.title}</div>
                <div>
                  <small>{prettifyDuration(song.duration_seconds)}</small>
                </div>
              </div>
            </Card>
          {/each}
        </div>
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
              <div>File uploaded successfully!</div>
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
                name="releaseGenres"
                placeholder="Genres (comma-separated)"
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
      </div>
    {:else if dashboardState.activeSection === "profile"}
      <ProfileSummary {activeArtist} />
    {:else if dashboardState.activeSection === "stats"}
      <div class="artist-stats">
        <h2>Stats</h2>
        <div><strong>Total streams:</strong> {activeArtistStreams.length}</div>
        <div>
          <strong>Average payout per stream:</strong>
          {calculateAveragePayout(activeArtistStreams).toFixed(2)}p
        </div>
        <div>
          <strong>Total earnings:</strong>
          {calculateTotalEarnings(activeArtistStreams, "readable-string")}
        </div>
      </div>
      <!-- {:else if dashboardState.activeSection === "payouts"}
      <div class="artist-payouts">
        <h2>Payouts</h2>
        <div>
          Total earnings: {calculateTotalEarnings(
            activeArtistStreams,
            "readable-string"
          )}
        </div>
      </div> -->
    {/if}
  {:else}
    <div>Select an artist to manage their releases and songs.</div>
  {/if}
</div>

<style>
  .dashboard {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 2rem;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  input[type="text"],
  input[type="date"],
  input[type="number"],
  select {
    padding: 0.5rem;
    border-radius: 4px;
  }
  .hidden {
    display: none;
  }
  .releases-list,
  .songs-list {
    min-width: 300px;
    max-width: 500px;
  }
  .releases-list {
    flex: 2;
  }
  .songs-list {
    flex: 1;
  }
  .forms {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    flex: 1;
  }
  .song-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  small {
    font-weight: 500;
    font-size: 70%;
  }
</style>
