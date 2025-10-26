import type { Artist } from "../../../shared/types/core";

export const dashboardState: {
  activeArtist: Artist | null;
  activeSection: DashboardSectionId;
} = $state({
  activeArtist: null,
  activeSection: "profile",
});

export type DashboardSectionId = "profile" | "music" | "stats" | "payouts";
