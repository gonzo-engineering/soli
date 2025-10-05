import { fail, json, redirect, type Actions } from "@sveltejs/kit";
import { pinata } from "$lib/server/pinata";
import { supabase } from "$lib/server/supabase";
import { API_BASE, PINATA_ARTIST_IMAGES_GROUP } from "$lib/config";

export const actions: Actions = {
  uploadTrack: async ({ request }) => {
    try {
      const formData = await request.formData();

      const res = await fetch(`${API_BASE}/tracks`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.error) {
        console.error("Error inserting track into Supabase:", result.error);
        return fail(500, { error: true, message: "Failed to save track data" });
      }
      return {
        message: `File was uploaded successfully`,
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return json({ error: "Internal Server Error", status: 500 });
    }
  },
  addRelease: async ({ request }) => {
    try {
      const formData = await request.formData();

      const response = await fetch(`${API_BASE}/releases`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Error inserting release into Supabase:", response);
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
  updateArtistDetails: async ({ request }) => {
    try {
      const formData = await request.formData();
      const artistId = formData.get("artistID") as string;
      const artistExistingImageCID = formData.get("existingImageCID") as
        | string
        | undefined;
      const artistImage = formData.get("artistImageNew") as File | null;
      const artistName = formData.get("artistName") as string;
      const artistBio = formData.get("artistBio") as string | undefined;
      const artistWebsite = formData.get("artistWebsite") as string | undefined;

      if (!artistId) {
        return fail(400, {
          error: true,
          message: "Artist ID required",
        });
      }

      let imageCid: string | undefined = artistExistingImageCID;
      if (artistImage && artistImage.size > 0) {
        const pinataFileName = `${artistName} profile image`;
        const upload = await pinata.upload.public
          .file(artistImage)
          .name(pinataFileName)
          .group(PINATA_ARTIST_IMAGES_GROUP);

        if (!upload || !upload.cid) {
          console.error("Error uploading artist image to Pinata:", upload);
          return fail(500, {
            error: true,
            message: "Failed to upload artist image to Pinata",
          });
        }
        // TODO: Delete old artist image if it exists
        imageCid = upload.cid;
      }

      const response = await fetch(`${API_BASE}/artists/${artistId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio: artistBio?.trim(),
          website_url: artistWebsite?.trim(),
          image_ipfs_cid: imageCid,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error updating artist details:", error);
        return fail(500, {
          error: true,
          message: "Failed to update artist details",
        });
      }

      return { status: 200, message: "Artist details updated successfully" };
    } catch (error) {
      console.log(error);
      return json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
  signout: async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (session) {
      await supabase.auth.signOut();
      redirect(303, "/");
    }
  },
};
