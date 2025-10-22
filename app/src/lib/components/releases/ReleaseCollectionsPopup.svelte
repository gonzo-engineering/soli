<script lang="ts">
	import { addOrRemoveRelease } from '$lib/remote-functions/collections.remote';
	import type { ReleaseHydrated, Collection } from '../../../../../shared/types';

	let {
		release,
		collections,
		collectionMenuOpen = $bindable()
	}: {
		release: ReleaseHydrated;
		collections: Collection[];
		collectionMenuOpen: boolean;
	} = $props();
</script>

<div class="add-to-collection-popup">
	<h3>Manage which collections {release.title} belongs to</h3>
	{#each collections as collection}
		<div class="collection-toggle">
			<div class="collection-name">{collection.name}</div>
			<form {...addOrRemoveRelease.for(collection.id)}>
				<input {...addOrRemoveRelease.fields.releaseId.as('hidden')} value={release.id} />
				<input {...addOrRemoveRelease.fields.collectionId.as('hidden')} value={collection.id} />
				<input
					{...addOrRemoveRelease.fields.addOrRemove.as('hidden')}
					value={collection.releases?.some((r) => r.id === release.id) ? 'remove' : 'add'}
				/>
				<button type="submit">
					{collection.releases?.some((r) => r.id === release.id) ? 'Remove' : 'Add'}
				</button>
			</form>
		</div>
	{/each}
	<button onclick={() => (collectionMenuOpen = false)}>Close</button>
</div>

<style>
	.add-to-collection-popup {
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
	.collection-name {
		display: inline-block;
	}
	.collection-toggle {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
</style>
