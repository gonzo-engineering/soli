<script lang="ts">
	import { addTrackToRelease } from '$lib/remote-functions/music.remote';
	import type { ReleaseHydrated, Track } from '@soli/shared/types';

	const {
		releases,
		tracks
	}: {
		releases: ReleaseHydrated[];
		tracks: Track[];
	} = $props();
</script>

<h3>Add Track to Release</h3>

<form {...addTrackToRelease}>
	<label>
		Release
		<select
			{...addTrackToRelease.fields.releaseId.as('select')}
			disabled={!!addTrackToRelease.pending}
		>
			{#each releases as release}
				<option value={release.id}>{release.title}</option>
			{/each}
		</select>
	</label>
	<label>
		Track
		<select
			{...addTrackToRelease.fields.trackId.as('select')}
			disabled={!!addTrackToRelease.pending}
		>
			{#each tracks as track}
				<option value={track.id}>{track.title}</option>
			{/each}
		</select>
	</label>
	<label>
		Track number
		<input
			{...addTrackToRelease.fields.trackNumber.as('number')}
			disabled={!!addTrackToRelease.pending}
		/>
	</label>
	<button type="submit" disabled={!!addTrackToRelease.pending}>
		{addTrackToRelease.pending ? 'Adding...' : 'Add to Release'}
	</button>
</form>
