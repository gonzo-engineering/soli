<script lang="ts">
	import { ButtonWrapper, Icon, PopupWrapper } from '@soli/shared/components';
	import type { ReleaseHydrated } from '@soli/shared/types';
	import { formatReleaseType } from '@soli/shared/utils';

	import { deleteRelease } from '$lib/remote-functions/music.remote';
	import { makeImageLink } from '$lib/utils';

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
		<Icon key="threeDots" size={24} />
	</ButtonWrapper>
</div>

{#if popupMenuOpen}
	<PopupWrapper bind:popupMenuOpen>
		<div>{release.title}</div>
		<ButtonWrapper label="Delete Release" onClickFunction={() => deleteRelease(release.id)}>
			<div class="delete">Delete Release <Icon key="bin" size={24} /></div>
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
