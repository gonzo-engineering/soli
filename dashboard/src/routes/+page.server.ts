import { fail, json, type Actions } from "@sveltejs/kit";
import { pinata } from "$lib/server/pinata";
import { supabase } from "$lib/server/stripe";
import { parseFile } from "music-metadata";
import fs from "fs/promises";

// const {
// 	data: connectedArtistsData,
// 	error: userError
// }: {
// 	data: { artist_id: string }[] | null;
// 	error: Error | null;
// } = await supabase.from(TABLES.artistMembers).select('artist_id').eq('user_id', session.user.id);

// if (userError || !connectedArtistsData) {
// 	console.error('Error fetching user data:', userError);
// 	return fail(500, { error: 'Failed to fetch user data' });
// }

// const artistProfiles: ArtistRaw[] = await Promise.all(
// 	connectedArtistsData.map((artist) => {
// 		return fetch(`/api/artists/${artist.artist_id}`)
// 			.then((res) => res.json())
// 			.catch((error) => {
// 				console.error(`Error fetching artist ${artist.artist_id}:`, error);
// 				return null;
// 			});
// 	})
// );

export const actions: Actions = {
  uploadTrack: async ({ request }) => {
    try {
      const formData = await request.formData();
      const uploadedFile = formData?.get("fileToUpload") as File;
      const uploadedFileTitle = formData?.get("title") as string;
      const artistName = formData?.get("artistName") as string;
      const artistId = formData?.get("artistID") as string;
      const artistGroup = formData?.get("artistGroup") as string;

      if (!uploadedFile.name || uploadedFile.size === 0) {
        return fail(400, {
          error: true,
          message: "You must provide a file to upload",
        });
      }
      if (!artistName || !artistId || !artistGroup) {
        return fail(400, {
          error: true,
          message: "Artist name, ID, and group are required",
        });
      }

      // Write to temporary file system
      const bytes = await uploadedFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = `/tmp/${uploadedFile.name}`;

      await fs.writeFile(tempPath, buffer);

      const metadata = await parseFile(tempPath);
      const duration = Math.round(metadata.format.duration || 0);

      await fs.unlink(tempPath); // Clean up temporary file

      const pinataFileName = `${artistName} - ${uploadedFileTitle}`;

      const upload = await pinata.upload.private
        .file(uploadedFile)
        .name(pinataFileName)
        .group(artistGroup);

      const { error } = await supabase.from("tracks").insert({
        title: uploadedFileTitle,
        ipfs_cid: upload.cid,
        artist_id: artistId,
        duration_seconds: duration,
      });

      if (error) {
        console.error("Error inserting track into Supabase:", error);
        return fail(500, { error: true, message: "Failed to save track data" });
      }

      const url = await pinata.gateways.public.convert(upload.cid);
      return { url, filename: uploadedFile.name, status: 200 };
    } catch (error) {
      console.log(error);
      return json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
  addRelease: async ({ request }) => {
    try {
      const formData = await request.formData();
      const releaseArtwork = formData.get("releaseArtwork") as File;
      const releaseName = formData.get("releaseTitle") as string;
      const artistId = formData.get("artistID") as string;
      const releaseType = formData.get("releaseType") as string;
      const releaseDate = formData.get("releaseDate") as string;
      const releaseTags = formData.get("releaseTags") as string;

      if (!releaseName || !artistId) {
        return fail(400, {
          error: true,
          message: "Release name, artist ID, and group are required",
        });
      }

      const pinataFileName = `'${releaseName}' cover art`;
      const upload = await pinata.upload.public
        .file(releaseArtwork)
        .name(pinataFileName)
        // TODO: Move this to environment variable
        .group("f4ffc1db-8d43-4fee-890b-950b692b8ca1");

      if (!upload || !upload.cid) {
        console.error("Error uploading artwork to Pinata:", upload);
        return fail(500, {
          error: true,
          message: "Failed to upload artwork to Pinata",
        });
      }

      const { error } = await supabase.from("releases").insert({
        title: releaseName,
        release_type: releaseType,
        artist_id: artistId,
        artwork_ipfs_cid: upload.cid,
        release_date: new Date(releaseDate).toISOString().split("T")[0],
        tags: releaseTags
          ? releaseTags.split(",").map((tag) => tag.trim())
          : [],
      });

      if (error) {
        console.error("Error inserting release into Supabase:", error);
        return fail(500, {
          error: true,
          message: "Failed to save release data",
        });
      }

      return { status: 200, message: "Release added successfully" };
    } catch (error) {
      console.log(error);
      return json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
  addTrackToRelease: async ({ request }) => {
    try {
      const formData = await request.formData();
      const releaseId = formData.get("releaseID") as string;
      const trackId = formData.get("trackID") as string;
      const trackNumber = formData.get("trackNumber") as string;

      if (!releaseId || !trackId) {
        return fail(400, {
          error: true,
          message: "Release ID and track ID are required",
        });
      }

      const { error } = await supabase.from("release_tracks").insert({
        release_id: releaseId,
        track_id: trackId,
        track_number: parseInt(trackNumber) || 0, // Default to 0 if not provided
      });

      if (error) {
        console.error("Error inserting track into release:", error);
        return fail(500, {
          error: true,
          message: "Failed to add track to release",
        });
      }

      return { status: 200, message: "Track added to release successfully" };
    } catch (error) {
      console.log(error);
      return json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
};
