import type { ArtistRaw } from "../../../shared/types";

export const dashboardState: {
  activeArtist: ArtistRaw | null;
  activeSection: DashboardSectionId;
} = $state({
  activeArtist: null,
  activeSection: "profile",
});

export type DashboardSectionId = "profile" | "music" | "stats" | "payouts";
