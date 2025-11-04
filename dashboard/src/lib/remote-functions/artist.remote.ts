import { form, getRequestEvent, query } from "$app/server";
import {
  API_BASE,
  PINATA_ARTIST_IMAGES_GROUP,
  REQUEST_HEADER_BOILERPLATE,
} from "$lib/config";
import * as z from "zod";
import { pinata } from "$lib/server/pinata";
import { fail, redirect } from "@sveltejs/kit";

const ArtistDetailsForm = z.object({
  artistId: z.string(),
  artistName: z.string().min(1),
  artistImageNew: z.instanceof(File).optional(),
  artistBio: z.string().max(1000).optional(),
  artistWebsite: z.string().optional(),
});

export const updateArtistDetails = form(ArtistDetailsForm, async (data) => {
  let imageCid: string | undefined;
  if (data.artistImageNew && data.artistImageNew.size > 0) {
    const pinataFileName = `${data.artistName} profile image`;
    const upload = await pinata.upload.public
      .file(data.artistImageNew)
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
  await fetch(`${API_BASE}/artists/${data.artistId}`, {
    method: "PATCH",
    headers: REQUEST_HEADER_BOILERPLATE,
    body: JSON.stringify({
      id: data.artistId,
      image_ipfs_cid: imageCid,
      bio: data.artistBio,
      website_url: data.artistWebsite,
    }),
  });
});

export const signOut = query(async () => {
  const { locals } = getRequestEvent();
  if (locals.session) {
    await locals.supabase.auth.signOut();
  }
});
