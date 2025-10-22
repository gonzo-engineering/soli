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
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Albums from '$lib/components/icons/Albums.svelte';

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
	let updatingCollection = $state(false);

	const handleUpdatingCollection: SubmitFunction = () => {
		updatingCollection = true;
		return async ({ update }) => {
			updatingCollection = false;
			update();
		};
	};
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
		<div class="add-to-collection-popup">
			<h3>Add {release.title} to collection{data.collections?.length > 1 ? 's' : ''}</h3>
			{#each data.collections as collection}
				<form
					method="post"
					action={`/me/collections?/addOrRemoveRelease`}
					use:enhance={handleUpdatingCollection}
				>
					<input type="hidden" name="releaseId" value={release.id} />
					<label for={`collection-${collection.id}`}>{collection.name}</label>
					<input
						type="hidden"
						name="add"
						value={collection.releases.some((r) => r.id === release.id) ? 'false' : 'true'}
					/>
					<input
						type="hidden"
						id={`collection-${collection.id}`}
						name="collectionId"
						value={collection.id}
					/>
					<button
						type="submit"
						name="action"
						value="addOrRemoveRelease"
						disabled={updatingCollection}
					>
						{collection.releases.some((r) => r.id === release.id) ? 'Remove' : 'Add'}
					</button>
				</form>
			{/each}
			<button onclick={() => (collectionMenuOpen = false)}>Close</button>
		</div>
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
	.add-to-collection-popup {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 1px solid gray;
		padding: 1rem;
		border-radius: 4px;
		background-color: var(--color-background-secondary);
		box-shadow: var(--box-shadow);
	}
</style>
