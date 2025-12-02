import type { Session } from '@supabase/supabase-js';
import type { Mixtape, Release, Track, Listener } from '../../../../shared/types/core';
import type { CollectionHydrated, TrackHydrated } from '../../../../shared/types/hydrated';

interface UserState {
	activeSong: Track | null;
	activeSongRelease: Release | null;
	activeSongUrl: string | null;
	activeSongIsPaused: boolean;
	autoPlay: boolean;
}

export interface UserData {
	session: Session;
	profileData: Listener;
	collections: CollectionHydrated[];
	likedTracks: TrackHydrated[];
	mixtapes: Mixtape[];
}

export const userState: UserState = $state({
	activeSong: null,
	activeSongRelease: null,
	activeSongUrl: null,
	activeSongIsPaused: false,
	autoPlay: false
});
