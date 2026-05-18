<script lang="ts">
	import '../../../shared/styles/reset.css';
	import '../../../shared/styles/global.css';
	import { dashboardState, type DashboardSectionId } from '$lib/state.svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { signOut } from '$lib/remote-functions/login.remote';
	import ButtonWrapper from '$lib/components/layout/ButtonWrapper.svelte';

	let { children, data } = $props();

	let { supabase, session, artists, labels } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});

	const artistDashboardSections: { id: DashboardSectionId; name: string }[] = [
		{ id: 'profile', name: 'Profile' },
		{ id: 'music', name: 'Music' },
		{ id: 'stats', name: 'Stats' }
	];

	const labelDashboardSections: { id: DashboardSectionId; name: string }[] = [
		{ id: 'profile', name: 'Profile' },
		{ id: 'artists', name: 'Artists' }
	];
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="dashboard-container">
	{#if session}
		<div class="side-panel">
			<h1>Soli • Dashboard</h1>
			<hr />
			<div>User: {session.user.email}</div>
			{#if artists && artists.length > 0}
				<h3>Your linked artists</h3>
				<select
					class="artist-selector"
					onchange={(e) => {
						const selectedId = (e.target as HTMLSelectElement).value;
						dashboardState.activeArtist = artists.find((a) => a.id === selectedId) || null;
						dashboardState.activeSection = 'profile';
					}}
				>
					<option value="" disabled selected>Select an artist</option>
					{#each artists as artist}
						<option value={artist.id} class:active={dashboardState.activeArtist?.id === artist.id}>
							{artist.name}
						</option>
					{/each}
				</select>
			{:else}
				<li>No artists found.</li>
			{/if}
			{#if labels && labels.length > 0}
				<h3>Your linked labels</h3>
				<select
					class="label-selector"
					onchange={(e) => {
						const selectedId = (e.target as HTMLSelectElement).value;
						dashboardState.activeLabel = labels.find((l) => l.id === selectedId) || null;
						dashboardState.activeSection = 'profile';
					}}
				>
					<option value="" selected>Select a label</option>
					{#each labels as label}
						<option value={label.id}>
							{label.name}
						</option>
					{/each}
				</select>
			{/if}
			{#if dashboardState.activeArtist}
				<hr />
				{#each artistDashboardSections as section}
					<div
						class="section-selector"
						class:active={dashboardState.activeSection === section.id}
						role="button"
						onclick={() => {
							dashboardState.activeSection = section.id;
						}}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								dashboardState.activeSection = section.id;
							}
						}}
						aria-label={`${section.name} Section`}
						tabindex="0"
					>
						{section.name}
					</div>
				{/each}
			{/if}
			{#if dashboardState.activeLabel}
				<hr />
				{#each labelDashboardSections as section}
					<div
						class="section-selector"
						class:active={dashboardState.activeSection === section.id}
						role="button"
						onclick={() => {
							dashboardState.activeSection = section.id;
						}}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								dashboardState.activeSection = section.id;
							}
						}}
						aria-label={`${section.name} Section`}
						tabindex="0"
					>
						{section.name}
					</div>
				{/each}
			{/if}
			<hr />
			<ButtonWrapper
				label="Sign Out"
				onClickFunction={() => {
					signOut().then(() => {
						location.reload();
					});
				}}
			>
				Sign Out
			</ButtonWrapper>
		</div>
	{/if}

	<main>
		{@render children()}
	</main>
</div>

<style>
	:global {
		form {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
		input,
		textarea,
		select {
			width: 100%;
			padding: 0.5rem;
		}
		.issue {
			color: rgb(255, 162, 162);
		}
	}
	.dashboard-container {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: row;
		overflow: hidden;
	}
	h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}
	h3 {
		margin: 0.5rem 0;
	}
	.section-selector {
		padding: 0.5rem;
		line-height: 1.1;
		cursor: pointer;
		border-radius: 4px;
		transition: background-color 0.2s ease;
	}
	select {
		padding: 0.5rem;
		border-radius: 4px;
	}
	.side-panel {
		width: 350px;
		color: white;
		background-color: #313131;
		padding: 2rem;
	}
	main {
		flex: 1;
		padding: 2rem;
		overflow-y: auto;
	}
	.active {
		background-color: #444;
		color: white;
		transition: background-color 0.2s ease;
	}
	hr {
		margin: 1rem 0 2rem 0;
		border: none;
		border-top: 1px solid gray;
	}
</style>
