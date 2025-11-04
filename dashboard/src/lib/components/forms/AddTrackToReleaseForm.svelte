<script lang="ts">
  import { addTrackToRelease } from "$lib/remote-functions/music.remote";
  import type { Track } from "../../../../../shared/types/core";
  import type { ReleaseHydrated } from "../../../../../shared/types/hydrated";

  const {
    releases,
    tracks,
  }: {
    releases: ReleaseHydrated[];
    tracks: Track[];
  } = $props();
</script>

<h3>Add Track to Release</h3>

<form {...addTrackToRelease}>
  <label>
    Release
    <select {...addTrackToRelease.fields.releaseId.as("select")}>
      {#each releases as release}
        <option value={release.id}>{release.title}</option>
      {/each}
    </select>
  </label>
  <label>
    Track
    <select {...addTrackToRelease.fields.trackId.as("select")}>
      {#each tracks as track}
        <option value={track.id}>{track.title}</option>
      {/each}
    </select>
  </label>
  <label>
    Track number
    <input {...addTrackToRelease.fields.trackNumber.as("number")} />
  </label>
  <button type="submit"> Add to Release </button>
</form>
