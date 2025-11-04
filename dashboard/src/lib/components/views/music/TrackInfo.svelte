<script lang="ts">
  import { deleteTrack } from "$lib/remote-functions/music.remote";
  import type { Track } from "../../../../../../shared/types/core";
  import { prettifyDuration } from "../../../../../../shared/utils";
  import BinIcon from "../../icons/BinIcon.svelte";
  import ButtonWrapper from "../../layout/ButtonWrapper.svelte";

  const { song }: { song: Track } = $props();
</script>

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

<style>
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
