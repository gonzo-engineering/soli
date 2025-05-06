<script lang="ts">
	import type { ArtistManifest, Release, UserProfile } from '$lib/types';
	import { prettifyDuration } from '$lib/utils';
	import { setActiveSong, userState } from '$lib/global/state.svelte';
	import type { Session } from '@supabase/supabase-js';

	let {
		data
	}: {
		data: {
			release: Release;
			artistManifest: ArtistManifest;
			profileData: UserProfile;
			session: Session;
		};
	} = $props();

	const release = data.release;
	const artist = data.artistManifest;
</script>

<svelte:head>
	<title>{release.title} · Releases · Soli</title>
	<meta
		name="description"
		content={`The release page for ${release.title} by ${release.artistName}.`}
	/>
</svelte:head>

<small>Releases</small>

<h2>{release.title}</h2>

<div>
	<a href={`/artists/${artist.artist.id}`}>{release.artistName}</a>
</div>

<div>
	{release.type} released {new Date(release.release_date).toLocaleDateString()}
</div>

<img
	src={release.coverLink}
	alt={`Cover art for '${release.title}' by ${release.artistName}'`}
	class="cover-art"
/>

<table>
	<thead>
		<tr>
			<th></th>
			<th>Track</th>
			<th>Duration</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each release.tracks as track, i}
			<tr>
				<td>{i + 1}</td>
				<td>{track.name}</td>
				<td>{prettifyDuration(track.duration_in_seconds)}</td>
				<td>
					{#if userState.liveBalance}
						<button
							class="play-button"
							onclick={() =>
								setActiveSong(
									track,
									artist,
									data.session.user.id,
									userState.liveBalance ?? data.profileData.tokens_balance,
									data.profileData.pay_per_stream
								)}
						>
							{#if track.cid === userState.activeSong?.cid}
								<span>Playing</span>
							{:else}
								<span>Play</span>
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
	.cover-art {
		aspect-ratio: 1/1;
		background-color: lightgray;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}
</style>
