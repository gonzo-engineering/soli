<script>
	import { artistDetails } from '../data/info/artist';
	import FancyReleaseCard from '$lib/components/FancyReleaseCard.svelte';
	import Divider from '$lib/components/releases/Divider.svelte';
	import { artistSchema } from '../data/info/artist';
	import { releases } from '../data/info/releases';

	const mostRecentRelease = releases.sort(
		(a, b) => b.releaseDate.getMilliseconds() - a.releaseDate.getMilliseconds()
	)[0];
</script>

<svelte:head>
	<title>{artistDetails.name}</title>
	<meta name="description" content={artistDetails.bios.short} />
</svelte:head>

<div class="content">
	<!-- Promote whatever the latest release is -->
	{#if mostRecentRelease}
		<FancyReleaseCard
			release={mostRecentRelease}
			subheading={`New ${mostRecentRelease.type} out now`}
			discType="Vinyl"
		/>
	{/if}
	<section />

	<Divider />

	<section>
		<div class="about-grid">
			<img src="/main-artist-image.jpg" alt={`Photo of ${artistDetails.name}`} loading="lazy" />
			<p>
				{artistDetails.bios.short}
			</p>
		</div>
	</section>

	<Divider />

	<section>
		<div>Visit the <a href="/music">music page</a> to browse releases, lyrics, and more.</div>
	</section>
</div>

{@html `<script type="application/ld+json">${JSON.stringify(artistSchema)}</script>`}

<style>
	.content {
		max-width: 800px;
		margin: 0 auto;
		text-align: center;
		font-size: 1.4rem;
	}

	.about-grid {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.about-grid p {
		text-align: left;
		font-weight: 500;
	}
	@media (min-width: 768px) {
		.about-grid {
			display: grid;
			grid-template-columns: 2fr 1fr;
			gap: 2rem;
		}
		.about-grid p {
			font-size: 1.6rem;
		}
	}
</style>
