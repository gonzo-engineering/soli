<script lang="ts">
	import type { ReleaseHydrated, UserProfile } from '../../../../../shared/types';
	import { prettifyDuration } from '$lib/utils';
	import type { Session } from '@supabase/supabase-js';
	import ReleaseTrackButton from './ReleaseTrackButton.svelte';

	const {
		release,
		profileData,
		session
	}: {
		release: ReleaseHydrated;
		profileData: UserProfile;
		session: Session;
	} = $props();
</script>

<table>
	<thead>
		<tr>
			<th>#</th>
			<th>Track</th>
			<th>Duration</th>
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
	tr:not(:last-child) {
		border-bottom: 1px solid gray;
	}
</style>
