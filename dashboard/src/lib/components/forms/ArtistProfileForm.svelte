<script lang="ts">
  import { updateArtistDetails } from "$lib/remote-functions/artist.remote";
  import { makeImageLink } from "$lib/utils";

  let {
    artistId,
    artistName,
    currentArtistImageCID,
    artistBio,
    artistWebsite,
  }: {
    artistId: string;
    artistName: string;
    currentArtistImageCID?: string;
    artistBio?: string;
    artistWebsite?: string;
  } = $props();
</script>

<form
  {...updateArtistDetails.enhance(({ submit }) => submit())}
  enctype="multipart/form-data"
>
  <input {...updateArtistDetails.fields.artistId.as("hidden", artistId)} />
  <input {...updateArtistDetails.fields.artistName.as("hidden", artistName)} />
  {#if currentArtistImageCID}
    <div>
      <img
        src={makeImageLink(currentArtistImageCID, 300)}
        alt="Current Artist Profile"
      />
    </div>
  {/if}
  <label>
    Change profile image
    <input {...updateArtistDetails.fields.artistImageNew.as("file")} />
  </label>
  <label>
    Bio
    <textarea
      {...updateArtistDetails.fields.artistBio.as("text")}
      value={artistBio}
    ></textarea>
  </label>
  {#each updateArtistDetails.fields.artistBio.issues() as issue}
    <div class="issue">{issue.message}</div>
  {/each}
  <label>
    Website
    <input
      {...updateArtistDetails.fields.artistWebsite.as("text")}
      value={artistWebsite}
    />
  </label>
  {#each updateArtistDetails.fields.artistWebsite.issues() as issue}
    <div class="issue">{issue.message}</div>
  {/each}
  <button
    type="submit"
    disabled={!!updateArtistDetails.pending}
    data-sveltekit-reload>Update profile</button
  >
</form>
