<script lang="ts">
  import { uploadTrack } from "$lib/remote-functions/music.remote";

  const {
    artistId,
    artistName,
    artistGroup,
  }: { artistId: string; artistName: string; artistGroup: string } = $props();
</script>

<h3>Upload Track</h3>

<form {...uploadTrack} enctype="multipart/form-data">
  <label>
    Track audio file
    <input {...uploadTrack.fields.file.as("file")} />
  </label>
  <label>
    Title
    <input {...uploadTrack.fields.title.as("text")} />
  </label>
  <input {...uploadTrack.fields.artistId.as("hidden", artistId)} />
  <input {...uploadTrack.fields.artistName.as("hidden", artistName)} />
  <input {...uploadTrack.fields.artistGroup.as("hidden", artistGroup)} />
  <button type="submit">Upload Track</button>
</form>
