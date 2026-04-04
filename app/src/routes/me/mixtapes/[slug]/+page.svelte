<script lang="ts">
	import BreadcrumbLinks from '$lib/components/layout/BreadcrumbLinks.svelte';
	import ButtonWrapper from '$lib/components/layout/ButtonWrapper.svelte';
	import TracksTable from '$lib/components/releases/TracksTable.svelte';
	import { userState, type UserData } from '$lib/global/state.svelte';
	import { deleteMixtape } from '$lib/remote-functions/mixtapes.remote';
	import { setActiveSong } from '$lib/utils/audio-playback';
	import type { MixtapeHydrated } from '../../../../../../shared/types/hydrated';

	let {
		data
	}: {
		data: UserData & {
			mixtape: MixtapeHydrated;
		};
	} = $props();

	let { id, name, description, tracks } = $derived(data.mixtape);

	let totalDurationSeconds = $derived(
		data.mixtape.tracks.reduce((sum, track) => sum + track.duration_seconds, 0)
	);

	const readableDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}m ${secs}s`;
	};
</script>

<svelte:head>
	<title>{name} · Your mixtapes · Soli</title>
	<meta name="description" content={`Browse the mixtape "${name}" on Soli.`} />
</svelte:head>

<BreadcrumbLinks
	breadcrumbs={[
		{ link: '/me', label: 'Me' },
		{ link: '/me/mixtapes', label: 'My mixtapes' }
	]}
/>

<div class="mixtape">
	<div class="mixtape-details">
		<h2>{name}</h2>
		<div>
			{tracks.length} song{tracks.length !== 1 ? 's' : ''}, {readableDuration(totalDurationSeconds)}
		</div>
		{#if description}
			<div>{description}</div>
		{/if}
	</div>
	<ButtonWrapper
		label="Play full mixtape"
		onClickFunction={() => {
			setActiveSong(
				tracks[0],
				tracks[0].release,
				data.profileData.tokens_balance,
				data.profileData.pay_per_stream,
				data.mixtape
			);
			userState.autoPlay = true;
		}}
	>
		<div class="play-full-mixtape-button">Play full mixtape</div>
	</ButtonWrapper>
	<TracksTable
		{tracks}
		userProfile={data.profileData}
		userLikedTracks={data.likedTracks}
		userMixtapes={data.mixtapes}
		showReleaseAndArtist
	/>
</div>

<form {...deleteMixtape.for(id)}>
	<input {...deleteMixtape.fields.mixtapeId.as('hidden', id)} />
	<button type="submit">Delete mixtape</button>
</form>

<style>
	h2 {
		margin-bottom: 0.5rem;
	}
	.mixtape {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}
	.play-full-mixtape-button {
		background-color: var(--color-accent);
		color: var(--color-background);
		width: 100%;
		border-radius: 4px;
		text-align: center;
		font-weight: 400;
		padding: 0.5rem 1rem;
	}
</style>
