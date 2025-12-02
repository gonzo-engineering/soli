import type { Session } from '@supabase/supabase-js';
import type { Mixtape, Release, Track, User } from '../../../../shared/types/core';
import type { CollectionHydrated, TrackHydrated } from '../../../../shared/types/hydrated';

interface UserState {
	id: string;
	activeSong: Track | null;
	activeSongRelease: Release | null;
	activeSongUrl: string | null;
	activeSongIsPaused: boolean;
	autoPlay: boolean;
	liveBalance: number;
	payPerStream: number;
}

export interface UserData {
	session: Session;
	profileData: User;
	collections: CollectionHydrated[];
	likedTracks: TrackHydrated[];
	mixtapes: Mixtape[];
}

export const userState: UserState = $state({
	// TODO: Make this less dumb
	id: '',
	activeSong: null,
	activeSongRelease: null,
	activeSongUrl: null,
	activeSongIsPaused: false,
	autoPlay: false,
	liveBalance: 0,
	payPerStream: 3
});
