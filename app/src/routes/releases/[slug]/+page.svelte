<script lang="ts">
	import type {
		Collection,
		LikedTrackObject,
		ReleaseHydrated,
		UserProfile
	} from '../../../../../shared/types';
	import { makeImageLink } from '$lib/utils';
	import type { Session } from '@supabase/supabase-js';
	import ReleaseTracks from '$lib/components/releases/TracksTable.svelte';
	import { setActiveSong, userState } from '$lib/global/state.svelte';
	import ButtonWrapper from '$lib/components/layout/ButtonWrapper.svelte';
	import { formatReleaseType } from '../../../../../shared/utils';
	import TagsGrid from '$lib/components/tags/TagsGrid.svelte';
	import Albums from '$lib/components/icons/Albums.svelte';
	import ReleaseCollectionsPopup from '$lib/components/releases/ReleaseCollectionsPopup.svelte';

	let {
		data
	}: {
		data: {
			release: ReleaseHydrated;
			session: Session;
			profileData: UserProfile;
			collections: Collection[];
			likedTracks: LikedTrackObject[];
		};
	} = $props();

	let release = $derived(data.release);
	let collectionMenuOpen = $state(false);
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
	<div class="release-header">
		<div>
			<h2>{release.title}</h2>

			<div>
				<a href={`/artists/${release.artist_id}`}>{release.artist_name}</a>
			</div>
		</div>
		<ButtonWrapper onClickFunction={() => (collectionMenuOpen = !collectionMenuOpen)}>
			<Albums />
		</ButtonWrapper>
	</div>

	{#if collectionMenuOpen}
		<ReleaseCollectionsPopup {release} collections={data.collections} bind:collectionMenuOpen />
	{/if}

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
			Play full {release.release_type === 'ep' ? 'EP' : release.release_type}
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
			{formatReleaseType(release.release_type)} released {new Date(
				release.release_date
			).toLocaleDateString()}
		</div>
		<TagsGrid slugs={release.genres ?? []} type="genres" />
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
	.release-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
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
	.play-full-release-button {
		background-color: var(--color-accent);
		color: var(--color-background);
		width: 100%;
		border-radius: 4px;
		text-align: center;
		font-weight: 400;
		padding: 0.5rem 1rem;
	}
</style>
