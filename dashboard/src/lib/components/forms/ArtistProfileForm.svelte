<script lang="ts">
  import { updateArtistDetails } from "$lib/remote-functions/artist.remote";
  import { makeImageLink } from "$lib/utils";

  const {
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

  console.log("artistId: ", artistId);
  console.log("artistName: ", artistName);
  console.log("currentArtistImageCID: ", currentArtistImageCID);
  console.log("artistBio: ", artistBio);
  console.log("artistWebsite: ", artistWebsite);
</script>

<form {...updateArtistDetails} enctype="multipart/form-data">
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
  <button type="submit" onclick={() => console.log("Updating profile...")}
    >Update profile</button
  >
</form>
