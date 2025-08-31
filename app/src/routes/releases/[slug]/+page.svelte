<script lang="ts">
	import type { LikedTrackObject, ReleaseHydrated, UserProfile } from '../../../../../shared/types';
	import { makeImageLink } from '$lib/utils';
	import type { Session } from '@supabase/supabase-js';
	import ReleaseTracks from '$lib/components/releases/TracksTable.svelte';
	import { setActiveSong, userState } from '$lib/global/state.svelte';
	import ButtonWrapper from '$lib/components/layout/ButtonWrapper.svelte';
	import { formatReleaseType } from '../../../../../shared/utils';

	let {
		data
	}: {
		data: {
			release: ReleaseHydrated;
			profileData: UserProfile;
			likedTracks: LikedTrackObject[];
			session: Session;
		};
	} = $props();

	const release = data.release;
	const releaseType = release.release_type;
</script>

<svelte:head>
	<title>{release.title} · {release.artist_name} · Soli</title>
	<meta
		name="description"
		content={`The release page for '${release.title}' by ${release.title}.`}
	/>
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

	<ButtonWrapper
		onClickFunction={() => {
			setActiveSong(
				release.tracks[0],
				release,
				data.session.user.id,
				userState.liveBalance ?? data.profileData.tokens_balance,
				userState.payPerStream
			);
			userState.autoPlay = true;
		}}
	>
		<div class="play-full-release-button">
			Play full {releaseType === 'ep' ? 'EP' : releaseType}
		</div>
	</ButtonWrapper>

	<ReleaseTracks
		{release}
		profileData={data.profileData}
		likedTracks={data.likedTracks}
		session={data.session}
	/>

	<hr />

	<div>
		<div>
			{formatReleaseType(releaseType)} released {new Date(
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
		box-shadow: var(--box-shadow);
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
	.play-full-release-button {
		background-color: var(--color-accent);
		color: var(--color-background);
		width: 100%;
		border-radius: 4px;
		text-align: center;
	}
</style>
