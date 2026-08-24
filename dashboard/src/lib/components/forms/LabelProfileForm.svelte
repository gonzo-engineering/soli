<script lang="ts">
	import { updateLabelDetails } from '$lib/remote-functions/label.remote';
	import { makeImageLink } from '$lib/utils';

	let {
		labelId,
		labelName,
		currentLabelImageCID,
		labelDescription,
		labelWebsite,
		labelLinks = []
	}: {
		labelId: string;
		labelName: string;
		currentLabelImageCID?: string;
		labelDescription?: string;
		labelWebsite?: string;
		labelLinks?: string[];
	} = $props();

	const pending = $derived(!!updateLabelDetails.pending);

	let links = $state([...labelLinks]);
	let newLink = $state('');

	const addLink = () => {
		const trimmed = newLink.trim();
		if (trimmed) {
			links = [...links, trimmed];
			newLink = '';
		}
	};

	const removeLink = (index: number) => {
		links = links.filter((_, i) => i !== index);
	};
</script>

<form
	{...updateLabelDetails.enhance(async ({ submit }) => {
		updateLabelDetails.fields.labelLinks.set(JSON.stringify(links));
		await submit();
	})}
	enctype="multipart/form-data"
	class:pending
>
	<input {...updateLabelDetails.fields.labelId.as('hidden', labelId)} />
	<input {...updateLabelDetails.fields.labelName.as('hidden', labelName)} />
	<input {...updateLabelDetails.fields.labelLinks.as('hidden', JSON.stringify(links))} />

	{#if currentLabelImageCID}
		<div>
			<img src={makeImageLink(currentLabelImageCID, 300)} alt="Current Label Profile" />
		</div>
	{/if}
	<label>
		Change profile image
		<input {...updateLabelDetails.fields.labelImageNew.as('file')} disabled={pending} />
	</label>
	<label>
		Description
		<textarea {...updateLabelDetails.fields.labelDescription.as('text')} value={labelDescription} disabled={pending}></textarea>
	</label>
	{#each updateLabelDetails.fields.labelDescription.issues() as issue}
		<div class="issue">{issue.message}</div>
	{/each}
	<label>
		Website
		<input {...updateLabelDetails.fields.labelWebsite.as('text')} value={labelWebsite} disabled={pending} />
	</label>
	{#each updateLabelDetails.fields.labelWebsite.issues() as issue}
		<div class="issue">{issue.message}</div>
	{/each}

	<div class="links-section">
		<p>Links</p>
		{#each links as link, i}
			<div class="link-row">
				<span>{link}</span>
				<button type="button" onclick={() => removeLink(i)} disabled={pending}>Remove</button>
			</div>
		{/each}
		<div class="link-add-row">
			<input
				type="url"
				placeholder="https://..."
				bind:value={newLink}
				disabled={pending}
				onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
			/>
			<button type="button" onclick={addLink} disabled={pending || !newLink.trim()}>
				Add link
			</button>
		</div>
	</div>

	<button type="submit" disabled={pending}>
		{pending ? 'Updating...' : 'Update profile'}
	</button>
</form>

<style>
	form {
		transition: opacity 0.2s ease;
	}
	form.pending {
		opacity: 0.6;
		pointer-events: none;
		cursor: wait;
	}
	.links-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.link-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.link-add-row {
		display: flex;
		gap: 0.5rem;
	}
	.link-add-row input {
		flex: 1;
	}
</style>