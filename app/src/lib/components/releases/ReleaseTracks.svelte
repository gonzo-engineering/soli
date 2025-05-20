<script lang="ts">
	import { setActiveSong, userState } from '$lib/global/state.svelte';
	import type { ReleaseHydrated, UserProfile } from '$lib/types';
	import { prettifyDuration } from '$lib/utils';
	import type { Session } from '@supabase/supabase-js';
	import Pause from '../icons/Pause.svelte';
	import Play from '../icons/Play.svelte';

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
					{#if userState.liveBalance}
						<button
							class="play-button"
							onclick={() => {
								if (track.ipfs_cid == userState.activeSong?.ipfs_cid) {
									// TODO: Pause the current song if it's playing
								} else {
									setActiveSong(
										track,
										{
											artistId: release.artist_id,
											artistName: release.artist_name
										},
										session.user.id,
										userState.liveBalance ?? profileData.tokens_balance,
										profileData.pay_per_stream
									);
								}
							}}
						>
							{#if track.ipfs_cid === userState.activeSong?.ipfs_cid}
								<Pause />
							{:else}
								<Play />
							{/if}
						</button>
					{:else}
						<button class="play-button" disabled>
							<span>Play</span>
						</button>
					{/if}
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
	tr {
		border-bottom: 1px solid lightgray;
	}
	tr:last-child {
		border-bottom: none;
	}
	.play-button-container {
		text-align: right;
	}
</style>
