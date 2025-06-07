import { fail, json, type Actions } from "@sveltejs/kit";
import { pinata } from "$lib/server/pinata";
import { supabase } from "$lib/server/stripe";
import type { ArtistRaw } from "../../../shared/types";

export const load = async () => {
  const groups = await pinata.groups.private.list();

  const {
    data,
    error,
  }: {
    data: ArtistRaw[] | null;
    error: Error | null;
  } = await supabase.from("artists").select("*");

  if (error) {
    console.error("Error fetching artists:", error);
    return fail(500, { error: "Failed to fetch artists" });
  }

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

  return { groups, artists: data };
};

export const actions: Actions = {
  default: async ({ request }) => {
    try {
      const formData = await request.formData();
      const uploadedFile = formData?.get("fileToUpload") as File;
      const uploadedFileTitle = formData?.get("title") as string;
      const artistId = formData?.get("artistId") as string;
      const artistGroup = formData?.get("artistGroup") as string;

      if (!uploadedFile.name || uploadedFile.size === 0) {
        return fail(400, {
          error: true,
          message: "You must provide a file to upload",
        });
      }

      const upload = await pinata.upload.private
        .file(uploadedFile)
        .name(uploadedFileTitle)
        .group(artistGroup);

      // TODO: Add track to Supabase database
      // const { data, error } = await supabase.from('tracks').insert({
      //   title: uploadedFileTitle,
      //   ipfs_cid: upload.cid,
      //   artist_id: artistId,
      //   duration_seconds: 0, // Placeholder, needs to be calculated
      //   created_at: new Date().toISOString()
      // });

      const url = await pinata.gateways.public.convert(upload.cid);
      return { url, filename: uploadedFile.name, status: 200 };
    } catch (error) {
      console.log(error);
      return json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
};
