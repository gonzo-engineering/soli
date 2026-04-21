<script lang="ts">
	let {
		name,
		image,
		link
	}: {
		name: string;
		image?: string;
		link: string;
	} = $props();
</script>

<a href={link}>
	<div class="artist-card">
		<div class="artist-circle">
			{#if image}
				<img src={image} alt={`Image of ${name}`} />
			{:else}
				<img src="/person-placeholder.png" alt="Placeholder person" />
			{/if}
		</div>
		<div class="artist-name">{name}</div>
	</div>
</a>

<style>
	.artist-card {
		max-width: 150px;
	}
	.artist-circle {
		border-radius: 50%;
		border: solid 2px var(--color-accent);
		margin-bottom: 0.4rem;
		img {
			object-fit: cover;
		}
	}
	.artist-name {
		text-align: center;
		font-size: 0.8rem;
		font-weight: 500;
		line-height: 1;
	}
	img {
		width: 100%;
		height: 100%;
		background-color: var(--color-accent);
		aspect-ratio: 1 / 1;
		border-radius: 50%;
	}
	img:hover {
		@media (min-width: 600px) {
			opacity: 0.6;
		}
	}
	a {
		text-decoration: none;
		color: inherit;
	}
</style>
