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
	<div class="artist-circle">
		{#if image}
			<img src={image} alt={`Image of ${name}`} />
		{:else}
			<img src="/person-placeholder.png" alt="Placeholder person" />
		{/if}
	</div>
	<div class="artist-name">{name}</div>
</a>

<style>
	.artist-circle {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		border: solid 2px lightgray;
		margin-bottom: 0.2rem;
	}
	.artist-name {
		text-align: center;
		font-size: 0.8rem;
		font-weight: 500;
	}
	img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		z-index: 0;
	}
	a {
		text-decoration: none;
		color: inherit;
	}
</style>
