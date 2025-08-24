<script lang="ts">
  import { makeImageLink } from "$lib/utils";
  import type { ReleaseHydrated } from "../../../../shared/types";
  import { formatReleaseType } from "../../../../shared/utils";

  const {
    release,
  }: {
    release: ReleaseHydrated;
  } = $props();
</script>

<div class="release-info">
  <div class="artwork">
    <img
      class="cover-artwork"
      src={makeImageLink(release.artwork_ipfs_cid, 150)}
      alt=""
    />
  </div>

  <div class="details">
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

<style>
  .release-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  h3 {
    margin: 0.5rem 0;
  }
  .artwork {
    flex: 1;
  }
  .details {
    flex: 2;
  }
  .cover-artwork {
    width: 150px;
    aspect-ratio: 1 / 1;
    box-shadow: var(--box-shadow);
  }
</style>
