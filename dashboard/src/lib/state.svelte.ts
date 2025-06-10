import type { ArtistRaw } from "../../../shared/types";

export const dashboardState: {
  activeArtist: ArtistRaw | null;
} = $state({
  activeArtist: null,
});
