<script lang="ts">
	import type { ArtistRaw, ReleaseHydrated, UserProfile } from '$lib/types';
	import { makeImageLink, prettifyDuration } from '$lib/utils';
	import { setActiveSong, userState } from '$lib/global/state.svelte';
	import type { Session } from '@supabase/supabase-js';

	let {
		data
	}: {
		data: {
			release: ReleaseHydrated;
			profileData: UserProfile;
			session: Session;
		};
	} = $props();

	const release = data.release;

	const formatReleaseType = (type: string) => {
		switch (type) {
			case 'single':
				return 'Single';
			case 'album':
				return 'Album';
			case 'ep':
				return 'EP';
			default:
				return type;
		}
	};
</script>

<svelte:head>
	<title>{release.title} · Releases · Soli</title>
	<meta name="description" content={`The release page for ${release.title} by ${release.title}.`} />
</svelte:head>

<small>Releases</small>

<h2>{release.title}</h2>

<div>
	<a href={`/artists/${release.artist_id}`}>{release.artist_name}</a>
</div>

<div>
	{formatReleaseType(release.release_type)} released {new Date(
		release.release_date
	).toLocaleDateString()}
</div>

<img
	src={makeImageLink(release.artwork_ipfs_cid)}
	alt={`Cover art for '${release.title}' by ${release.artist_name}'`}
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
				<td>{track.title}</td>
				<td>{prettifyDuration(track.duration_seconds)}</td>
				<td>
					{#if userState.liveBalance}
						<button
							class="play-button"
							onclick={() =>
								setActiveSong(
									track,
									{
										artistId: release.artist_id,
										artistName: release.artist_name
									},
									data.session.user.id,
									userState.liveBalance ?? data.profileData.tokens_balance,
									data.profileData.pay_per_stream
								)}
						>
							{#if track.ipfs_cid === userState.activeSong?.ipfs_cid}
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

{#each release.tags as tag}
	<div class="tag">{tag}</div>
{/each}

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
	.tag {
		display: inline-block;
		background-color: lightgray;
		color: #333;
		padding: 0 0.5rem;
		margin: 0.5rem 0;
		border-radius: 4px;
	}
</style>
