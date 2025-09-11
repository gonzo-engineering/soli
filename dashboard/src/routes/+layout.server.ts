import { fail } from "@sveltejs/kit";
import { supabase } from "$lib/server/stripe";
import type {
  ArtistRaw,
  ReleaseHydrated,
  ReleaseRaw,
  StreamLog,
  TrackRaw,
} from "../../../shared/types";
import { sortReleasesByDate } from "../../../shared/utils";
import type { LayoutServerLoad } from "./$types";
import { POWER_USER_ID } from "$lib/config";

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession },
  cookies,
}) => {
  const { session, user } = await safeGetSession();

  if (!session) {
    return {
      session,
      user,
      cookies: cookies.getAll(),
      artists: [],
      releasesRaw: [],
      releasesHydrated: [],
      songs: [],
      streams: [],
    };
  }

  const userID = session?.user.id;

  if (!userID) {
    return {
      session,
      user,
      cookies: cookies.getAll(),
      artists: [],
      releasesRaw: [],
      releasesHydrated: [],
      songs: [],
      streams: [],
    };
  }

  const {
    data: userData,
    error: userError,
  }: {
    data: { artist_id: string }[] | null;
    error: Error | null;
  } = await supabase
    .from("artist_members")
    .select("artist_id")
    .eq("user_id", userID);

  if (userError || !userData) {
    console.error("Error fetching user data:", userError);
    return fail(500, { error: "Failed to fetch user data" });
  }

  // Get all artist IDs for the user, unless they are a power user
  // in which case fetch all artists
  const {
    data: connectedArtists,
    error: artistsError,
  }: {
    data: ArtistRaw[] | null;
    error: Error | null;
  } =
    userID === POWER_USER_ID
      ? await supabase.from("artists").select("*")
      : await supabase
          .from("artists")
          .select("*")
          .in(
            "id",
            userData.map((u) => u.artist_id)
          );

  if (artistsError || !connectedArtists) {
    console.error("Error fetching artists:", artistsError);
    return fail(500, { error: "Failed to fetch artists" });
  }

  const {
    data: songs,
    error: songsError,
  }: {
    data: TrackRaw[] | null;
    error: Error | null;
  } = await supabase.from("tracks").select("*");

  const {
    data: releasesRaw,
    error: releasesError,
  }: {
    data: ReleaseRaw[] | null; // Adjust type as needed
    error: Error | null;
  } = await supabase.from("releases").select("*");
  if (releasesError || !releasesRaw) {
    console.error("Error fetching releases:", releasesError);
    return fail(500, { error: "Failed to fetch releases" });
  }

  const {
    data: releasesHydrated,
    error: releasesHydratedError,
  }: {
    data: ReleaseHydrated[] | null; // Adjust type as needed
    error: Error | null;
  } = await supabase.from("hydrated_releases").select("*");

  if (artistsError || !connectedArtists) {
    console.error("Error fetching artists:", artistsError);
    return fail(500, { error: "Failed to fetch artists" });
  }
  if (songsError || !songs) {
    console.error("Error fetching songs:", songsError);
    return fail(500, { error: "Failed to fetch songs" });
  }
  if (releasesHydratedError || !releasesHydrated) {
    console.error("Error fetching releases:", releasesHydratedError);
    return fail(500, { error: "Failed to fetch releases" });
  }

  songs.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });

  releasesRaw.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });

  connectedArtists.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  // Get all streams for the artist
  const {
    data: streams,
    error: streamsError,
  }: {
    data: StreamLog[] | null; // Adjust type as needed
    error: Error | null;
  } = await supabase.from("streams").select("*");
  if (streamsError || !streams) {
    console.error("Error fetching streams:", streamsError);
    return fail(500, { error: "Failed to fetch streams" });
  }

  return {
    session,
    user,
    cookies: cookies.getAll(),
    artists: connectedArtists,
    releasesRaw,
    releasesHydrated: sortReleasesByDate(releasesHydrated),
    songs,
    streams,
  };
};
