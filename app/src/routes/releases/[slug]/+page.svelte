<script lang="ts">
	import { makeImageLink } from '$lib/utils';
	import TracksTable from '$lib/components/releases/TracksTable.svelte';
	import { userState, type UserData } from '$lib/global/state.svelte';
	import ButtonWrapper from '$lib/components/layout/ButtonWrapper.svelte';
	import { formatReleaseType } from '../../../../../shared/utils';
	import TagsGrid from '$lib/components/tags/TagsGrid.svelte';
	import ReleaseCollectionsMenu from '$lib/components/releases/ReleaseCollectionsMenu.svelte';
	import PopupWrapper from '$lib/components/layout/PopupWrapper.svelte';
	import BreadcrumbLinks from '$lib/components/layout/BreadcrumbLinks.svelte';
	import type { ReleaseHydrated } from '../../../../../shared/types/hydrated';
	import { setActiveSong } from '$lib/utils/audio-playback';
	import ReleaseArtwork from '$lib/components/ReleaseArtwork.svelte';
	import Icon from '$lib/components/layout/Icon.svelte';

	let {
		data
	}: {
		data: UserData & {
			release: ReleaseHydrated;
		};
	} = $props();

	let release = $derived(data.release);
	let popupMenuOpen = $state(false);
</script>

<svelte:head>
	<title>{release.title} · {release.artist.name} · Soli</title>
	<meta
		name="description"
		content={`The release page for '${release.title}' by ${release.title}.`}
	/>
</svelte:head>

<BreadcrumbLinks breadcrumbs={[{ link: '/releases', label: 'Releases' }]} />

<div class="release-summary-card">
	<div class="release-header">
		<div>
			<h2>{release.title}</h2>
			<div>
				<a href={`/artists/${release.artist_id}`}>{release.artist.name}</a>
			</div>
		</div>
		<ButtonWrapper onClickFunction={() => (popupMenuOpen = !popupMenuOpen)}>
			<Icon key="albums" size={50} />
		</ButtonWrapper>
	</div>

	<ReleaseArtwork
		name={release.title}
		artist={release.artist.name}
		imageSrc={makeImageLink(release.artwork_ipfs_cid, 500)}
	/>

	<ButtonWrapper
		onClickFunction={() => {
			setActiveSong(
				release.tracks[0],
				release,
				data.profileData.tokens_balance,
				data.profileData.pay_per_stream
			);
			userState.autoPlay = true;
		}}
	>
		<div class="play-full-release-button">
			Play full {release.release_type === 'ep' ? 'EP' : release.release_type}
		</div>
	</ButtonWrapper>

	<TracksTable
		tracks={release.tracks.map((track) => ({
			...track,
			release,
			artist: release.artist
		}))}
		userProfile={data.profileData}
		userLikedTracks={data.likedTracks}
		userMixtapes={data.mixtapes}
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

{#if popupMenuOpen}
	<PopupWrapper bind:popupMenuOpen>
		<ReleaseCollectionsMenu {release} collections={data.collections} />
	</PopupWrapper>
{/if}

<style>
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
		gap: 1rem;
	}
	h2 {
		margin: 0;
		line-height: 1;
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
