<script lang="ts">
	let {
		name,
		artist = undefined,
		imageSrc,
		isAskew = false,
		growsOnHover = false
	}: {
		name: string;
		artist?: string;
		imageSrc: string;
		isAskew?: boolean;
		growsOnHover?: boolean;
	} = $props();

	const randomRotation = Math.floor(Math.random() * 4) - 2;
	const cardRotation = isAskew ? randomRotation : 0;
</script>

<img
	src={imageSrc}
	alt={`Artwork for ${name} by ${artist}`}
	style="--rotation: {cardRotation}deg"
	class:grows-on-hover={growsOnHover}
/>

<style>
	img {
		width: 100%;
		aspect-ratio: 1 / 1;
		box-shadow: var(--box-shadow);
		transform: rotate(var(--rotation));
		transition: transform 0.2s ease-in-out;
		background-color: lightgray;
	}
	@media (min-width: 600px) {
		.grows-on-hover:hover {
			transform: scale(1.05);
			transition: transform 0.2s ease-in-out;
		}
	}
</style>
