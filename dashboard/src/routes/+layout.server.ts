import { fail } from "@sveltejs/kit";
import { supabase } from "$lib/server/stripe";
import type {
  ArtistRaw,
  ReleaseHydrated,
  ReleaseRaw,
  TrackRaw,
} from "../../../shared/types";
import { sortReleasesByDate } from "../../../shared/utils";

export const load = async () => {
  const {
    data: artists,
    error: artistsError,
  }: {
    data: ArtistRaw[] | null;
    error: Error | null;
  } = await supabase.from("artists").select("*");

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

  if (artistsError || !artists) {
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

  artists.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  return {
    artists,
    releasesRaw,
    releasesHydrated: sortReleasesByDate(releasesHydrated),
    songs,
  };
};
