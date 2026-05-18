import type { Artist, Collection, Label, Mixtape, Release, Track } from './core';

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
	label?: Label;
}

export interface CollectionHydrated extends Collection {
	releases: ReleaseHydrated[];
}

export interface MixtapeHydrated extends Mixtape {
	tracks: TrackHydrated[];
}

export interface LabelHydrated extends Label {
	artists: Artist[];
}
