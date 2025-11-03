<script lang="ts">
  import type { GroupListResponse } from "pinata";
  import type { StreamLog } from "../../../shared/types/core";
  import { dashboardState } from "$lib/state.svelte";
  import Card from "$lib/components/Card.svelte";
  import ReleaseInfo from "$lib/components/ReleaseInfo.svelte";
  import ProfileSummary from "$lib/components/ProfileSummary.svelte";
  import { prettifyDuration } from "../../../shared/utils";
  import type { Artist, Release, Track } from "../../../shared/types/core";
  import type { ReleaseHydrated } from "../../../shared/types/hydrated";
  import UploadTrackForm from "$lib/components/forms/UploadTrackForm.svelte";
  import AddReleaseForm from "$lib/components/forms/AddReleaseForm.svelte";
  import AddTrackToReleaseForm from "$lib/components/forms/AddTrackToReleaseForm.svelte";
  import BinIcon from "$lib/components/icons/BinIcon.svelte";
  import { deleteTrack } from "$lib/remote-functions/music.remote";
  import ButtonWrapper from "$lib/components/layout/ButtonWrapper.svelte";

  let {
    data,
  }: {
    data: {
      groups: GroupListResponse;
      artists: Artist[];
      songs: Track[];
      releasesRaw: Release[];
      releasesHydrated: ReleaseHydrated[];
      streams: StreamLog[];
    };
  } = $props();

  let activeArtist: Artist | null = $derived(dashboardState.activeArtist);
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
                <div class="song-details-wrapper">
                  <div>{song.title}</div>
                  <div>
                    <small>{prettifyDuration(song.duration_seconds)}</small>
                  </div>
                </div>
                <ButtonWrapper onClickFunction={() => deleteTrack(song.id)}>
                  <BinIcon />
                </ButtonWrapper>
              </div>
            </Card>
          {/each}
        </div>
        <div>
          <h2>Manage</h2>
          <div class="forms">
            <Card>
              <UploadTrackForm
                artistId={activeArtist.id}
                artistName={activeArtist.name}
                artistGroup={activeArtist.pinata_group_id}
              />
            </Card>
            <Card>
              <AddReleaseForm artistId={activeArtist.id} />
            </Card>
            <Card>
              <AddTrackToReleaseForm
                releases={activeArtistReleasesRaw}
                tracks={activeArtistSongs}
              />
            </Card>
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
    gap: 1rem;
    flex: 1;
  }
  .song-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .song-details-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  small {
    font-weight: 500;
    font-size: 70%;
  }
</style>
