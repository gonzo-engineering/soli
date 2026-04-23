<script lang="ts">
	import type { Snippet } from 'svelte';
	import ButtonWrapper from './ButtonWrapper.svelte';

	let { children, popupMenuOpen = $bindable() }: { children: Snippet; popupMenuOpen: boolean } =
		$props();
</script>

<div class="popup-menu-wrapper">
	{@render children()}
	<ButtonWrapper label="Close popup" onClickFunction={() => (popupMenuOpen = false)}>
		<div class="close-button">Close</div>
	</ButtonWrapper>
</div>

<style>
	.popup-menu-wrapper {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 1px solid gray;
		padding: 1rem;
		border-radius: 4px;
		background-color: var(--color-background);
		box-shadow: var(--box-shadow);
		width: 90%;
		max-width: 400px;
	}
	.close-button {
		padding: 0.5rem;
		border-radius: 4px;
		background-color: var(--color-text);
		color: var(--color-background);
		text-align: center;
		margin-top: 1rem;
	}
</style>
