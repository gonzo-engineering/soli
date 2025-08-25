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
		showReleaseAndArtist = false
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
		showReleaseAndArtist: boolean;
	} = $props();
</script>

<tr>
	<td>{i || ''}</td>
	<td>{track.title}</td>
	{#if showReleaseAndArtist}
		<td class="hide-on-mobile"><a href={`/releases/${release.id}`}>{release.title}</a></td>
		<td><a href={`/artists/${release.artist_id}`}>{release.artist_name}</a></td>
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
	.hide-on-mobile {
		display: none;
	}
	@media (min-width: 640px) {
		.hide-on-mobile {
			display: table-cell;
		}
	}
</style>
