import type { Session } from '@supabase/supabase-js';
import type {
	ArtistHydrated,
	CollectionHydrated,
	Listener,
	MixtapeHydrated,
	Release,
	Track,
	TrackHydrated
} from '@soli/shared/types';

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
	mixtapes: MixtapeHydrated[];
	followedArtists: string[];
	linkedArtists: ArtistHydrated[];
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
