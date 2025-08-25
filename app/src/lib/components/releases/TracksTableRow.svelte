<script lang="ts">
	import type { ReleaseHydrated, TrackRaw, UserProfile } from '../../../../../shared/types';
	import { prettifyDuration } from '../../../../../shared/utils';
	import type { Session } from '@supabase/supabase-js';
	import ReleaseTrackButton from './ReleaseTrackButton.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Heart from '../icons/Heart.svelte';

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

	const handleFavTrackChange: SubmitFunction = () => {
		return async ({ update }) => {
			update();
		};
	};
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
		<form method="post" action="?/toggleLikedTrack" use:enhance={handleFavTrackChange}>
			<input type="hidden" name="trackId" value={track.id} />
			<button
				type="submit"
				name="action"
				value="toggleLikedTrack"
				aria-label="Remove from likes tracks"
			>
				{#if likedTracks.some((t) => t.track.id === track.id)}
					<Heart filled />
				{:else}
					<Heart />
				{/if}
			</button>
		</form>
	</td>
</tr>

<style>
	form {
		text-align: right;
	}
	tr:not(:last-child) {
		border-bottom: 1px solid gray;
	}
	form {
		display: flex;
		justify-content: flex-end;
	}
	button {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-text);
		display: flex;
	}
</style>
