<script lang="ts">
	import type { ReleaseHydrated, UserProfile } from '$lib/types';
	import { formatReleaseType, makeImageLink } from '$lib/utils';
	import type { Session } from '@supabase/supabase-js';
	import ReleaseTracks from '$lib/components/releases/ReleaseTracks.svelte';
	import { setActiveSong, userState } from '$lib/global/state.svelte';

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
</script>

<svelte:head>
	<title>{release.title} · Releases · Soli</title>
	<meta name="description" content={`The release page for ${release.title} by ${release.title}.`} />
</svelte:head>

<div class="section-link">
	> <a href="/releases">Releases</a>
</div>

<div class="release-summary-card">
	<div>
		<h2>{release.title}</h2>

		<div>
			<a href={`/artists/${release.artist_id}`}>{release.artist_name}</a>
		</div>
	</div>

	<img
		src={makeImageLink(release.artwork_ipfs_cid, 500)}
		alt={`Cover art for '${release.title}' by ${release.artist_name}'`}
		class="cover-art"
	/>

	<button
		onclick={() => {
			setActiveSong(
				release.tracks[0],
				{
					artistId: release.artist_id,
					artistName: release.artist_name
				},
				data.session.user.id,
				userState.liveBalance ?? data.profileData.tokens_balance,
				userState.payPerStream
			);
			const releaseTracks = release.tracks;
			releaseTracks.shift();
			userState.scheduledSongs = releaseTracks;
		}}>Play full release</button
	>

	<ReleaseTracks {release} profileData={data.profileData} session={data.session} />

	<hr />

	<div>
		<div>
			{formatReleaseType(release.release_type)} released {new Date(
				release.release_date
			).toLocaleDateString()}
		</div>

		{#each release.tags as tag}
			<div class="tag">{tag}</div>
		{/each}
	</div>
</div>

<style>
	.section-link {
		margin-bottom: 1rem;
	}
	.release-summary-card {
		max-width: 600px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	h2 {
		margin: 0;
		line-height: 1;
	}
	.cover-art {
		aspect-ratio: 1/1;
		background-color: lightgray;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	}
	.tag {
		display: inline-block;
		background-color: lightgray;
		color: #333;
		padding: 0 0.5rem;
		margin: 0.5rem 0;
		border-radius: 4px;
		width: fit-content;
	}
</style>
