<script lang="ts">
	import ThreeDotsIcon from '$lib/components/icons/ThreeDotsIcon.svelte';
	import PopupWrapper from '$lib/components/layout/PopupWrapper.svelte';
	import { deleteRelease } from '$lib/remote-functions/music.remote';
	import { makeImageLink } from '$lib/utils';
	import type { ReleaseHydrated } from '@soli/shared/types';
	import { formatReleaseType } from '@soli/shared/utils';
	import BinIcon from '../../icons/BinIcon.svelte';
	import ButtonWrapper from '../../layout/ButtonWrapper.svelte';

	const {
		release
	}: {
		release: ReleaseHydrated;
	} = $props();

	let popupMenuOpen = $state(false);
</script>

<div class="release-info">
	<div class="artwork">
		<img class="cover-artwork" src={makeImageLink(release.artwork_ipfs_cid, 150)} alt="" />
	</div>

	<div class="details">
		<h3>{release.title}</h3>
		<div><b>Type</b>: {formatReleaseType(release.release_type)}</div>
		<div><b>Release date</b>: {release.release_date}</div>
		<div><b>Track</b>:</div>
		<ol>
			{#each release.tracks as track}
				<li>
					{track.title}
				</li>
			{/each}
		</ol>
	</div>
	<ButtonWrapper label="Options" onClickFunction={() => (popupMenuOpen = !popupMenuOpen)}>
		<ThreeDotsIcon />
	</ButtonWrapper>
</div>

{#if popupMenuOpen}
	<PopupWrapper bind:popupMenuOpen>
		<div>{release.title}</div>
		<ButtonWrapper label="Delete Release" onClickFunction={() => deleteRelease(release.id)}>
			<div class="delete">Delete Release <BinIcon /></div>
		</ButtonWrapper>
	</PopupWrapper>
{/if}

<style>
	.release-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	h3 {
		margin: 0.5rem 0;
	}
	.artwork {
		flex: 1;
	}
	.details {
		flex: 2;
	}
	.cover-artwork {
		width: 150px;
		aspect-ratio: 1 / 1;
		box-shadow: var(--box-shadow);
	}
	.delete {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
