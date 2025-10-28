import type { Artist, Collection, Mixtape, Release, Track } from "./core";

export interface ReleaseHydrated extends Release {
  artist: Artist;
  tracks: Track[];
}

export interface TrackHydrated extends Track {
  release: Release;
  artist: Artist;
}

export interface ArtistHydrated extends Artist {
  releases: Release[];
}

export interface CollectionHydrated extends Collection {
  releases: ReleaseHydrated[];
}

export interface MixtapeHydrated extends Mixtape {
  tracks: TrackHydrated[];
}
