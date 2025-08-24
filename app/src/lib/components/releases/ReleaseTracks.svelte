<script lang="ts">
	import type { ReleaseHydrated, UserProfile } from '../../../../../shared/types';
	import { prettifyDuration } from '../../../../../shared/utils';
	import type { Session } from '@supabase/supabase-js';
	import ReleaseTrackButton from './ReleaseTrackButton.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Heart from '../icons/Heart.svelte';

	const {
		release,
		profileData,
		likedTrackIDs,
		session
	}: {
		release: ReleaseHydrated;
		profileData: UserProfile;
		likedTrackIDs: string[];
		session: Session;
	} = $props();

	const handleFavTrackChange: SubmitFunction = () => {
		return async ({ update }) => {
			update();
		};
	};
</script>

<table>
	<thead>
		<tr>
			<th>#</th>
			<th>Track</th>
			<th>Duration</th>
			<th></th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each release.tracks as track, i}
			<tr>
				<td>{i + 1}</td>
				<td>{track.title}</td>
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
							{#if likedTrackIDs.includes(track.id)}
								<Heart filled />
							{:else}
								<Heart />
							{/if}
						</button>
					</form>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}
	th {
		font-weight: 500;
	}
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
