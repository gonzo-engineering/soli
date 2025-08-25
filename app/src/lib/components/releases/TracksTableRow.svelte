<script lang="ts">
	import type { ReleaseHydrated, TrackRaw, UserProfile } from '../../../../../shared/types';
	import { prettifyDuration } from '../../../../../shared/utils';
	import type { Session } from '@supabase/supabase-js';
	import ReleaseTrackButton from './ReleaseTrackButton.svelte';
	import TrackLikeButton from './TrackLikeButton.svelte';

	const {
		i = undefined,
		track,
		release,
		profileData,
		session,
		likedTracks,
		showArtist = false
	}: {
		i?: number;
		track: TrackRaw;
		release: ReleaseHydrated;
		profileData: UserProfile;
		session: Session;
		likedTracks: {
			track: TrackRaw;
			release: ReleaseHydrated | null;
		}[];
		showArtist: boolean;
	} = $props();
</script>

<tr>
	<td>{i || ''}</td>
	<td>{track.title}</td>
	{#if showArtist}
		<td>{release.artist_name}</td>
	{/if}
	<td>{prettifyDuration(track.duration_seconds)}</td>
	<td class="play-button-container">
		<ReleaseTrackButton {track} {release} {profileData} {session} />
	</td>
	<td>
		<TrackLikeButton trackID={track.id} {likedTracks} lightOrDark={'light'} />
	</td>
</tr>

<style>
	tr:not(:last-child) {
		border-bottom: 1px solid gray;
	}
</style>
