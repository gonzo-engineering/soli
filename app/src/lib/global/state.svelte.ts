import type { Session } from '@supabase/supabase-js';
import type { Mixtape, Release, Track, Listener } from '../../../../shared/types/core';
import type {
	CollectionHydrated,
	MixtapeHydrated,
	TrackHydrated
} from '../../../../shared/types/hydrated';

interface UserState {
	activeSong: Track | null;
	activeSongRelease: Release | null;
	activeSongUrl: string | null;
	activeSongIsPaused: boolean;
	autoPlay: boolean;
	activeMixtape: MixtapeHydrated | null;
	activeStreamSessionId: string | null;
}

export interface UserData {
	session: Session;
	profileData: Listener;
	collections: CollectionHydrated[];
	likedTracks: TrackHydrated[];
	mixtapes: Mixtape[];
	followedArtists: string[];
}

export const userState: UserState = $state({
	activeSong: null,
	activeSongRelease: null,
	activeSongUrl: null,
	activeSongIsPaused: false,
	autoPlay: false,
	activeMixtape: null,
	activeStreamSessionId: null
});
