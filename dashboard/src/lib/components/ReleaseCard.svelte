<script lang="ts">
  import { makeImageLink } from "$lib/utils";
  import type { ReleaseHydrated } from "../../../../shared/types";
  import {
    formatReleaseType,
    prettifyDuration,
  } from "../../../../shared/utils";

  const {
    release,
  }: {
    release: ReleaseHydrated;
  } = $props();
</script>

<div class="card release-card">
  <div>
    <img
      class="cover-artwork"
      src={makeImageLink(release.artwork_ipfs_cid, 150)}
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
          {track.title} ({prettifyDuration(track.duration_seconds)})
        </li>
      {/each}
    </ol>
  </div>
</div>

<style>
  .release-card {
    display: flex;
    gap: 1rem;
    border: 1px solid #ccc;
    padding: 1rem;
    margin: 0.5rem 0;
    border-radius: 5px;
  }
  .cover-artwork {
    width: 150px;
    aspect-ratio: 1 / 1;
  }
</style>
