import type { ReleaseHydrated } from "../types";

export const formatReleaseType = (type: string) => {
  switch (type) {
    case "single":
      return "Single";
    case "album":
      return "Album";
    case "ep":
      return "EP";
    default:
      return type;
  }
};

export const sortReleasesByDate = (releases: ReleaseHydrated[]) => {
  return releases.sort((a, b) => {
    return (
      new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    );
  });
};
