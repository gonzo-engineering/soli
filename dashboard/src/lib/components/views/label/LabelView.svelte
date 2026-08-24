<script lang="ts">
	import LabelProfileForm from '$lib/components/forms/LabelProfileForm.svelte';
	import type { LabelHydrated } from '@soli/shared/types';

	let { activeLabel }: { activeLabel: LabelHydrated } = $props();
</script>

<div class="label-profile">
	<h2>Profile</h2>
	<h3>{activeLabel.name}</h3>
	<LabelProfileForm
		labelId={activeLabel.id}
		labelName={activeLabel.name}
		currentLabelImageCID={activeLabel.image_cid}
		labelDescription={activeLabel.description}
		labelWebsite={activeLabel.website_url}
		labelLinks={activeLabel.links}
	/>
</div>

<style>
	.label-profile {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}
</style>
