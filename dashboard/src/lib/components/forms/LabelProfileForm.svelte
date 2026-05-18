<script lang="ts">
	import { updateLabelDetails } from '$lib/remote-functions/label.remote';
	import { makeImageLink } from '$lib/utils';

	let {
		labelId,
		labelName,
		currentLabelImageCID,
		labelDescription,
		labelWebsite
	}: {
		labelId: string;
		labelName: string;
		currentLabelImageCID?: string;
		labelDescription?: string;
		labelWebsite?: string;
	} = $props();
</script>

<form {...updateLabelDetails.enhance(({ submit }) => submit())} enctype="multipart/form-data">
	<input {...updateLabelDetails.fields.labelId.as('hidden', labelId)} />
	<input {...updateLabelDetails.fields.labelName.as('hidden', labelName)} />
	{#if currentLabelImageCID}
		<div>
			<img src={makeImageLink(currentLabelImageCID, 300)} alt="Current Label Profile" />
		</div>
	{/if}
	<label>
		Change profile image
		<input
			{...updateLabelDetails.fields.labelImageNew.as('file')}
			disabled={!!updateLabelDetails.pending}
		/>
	</label>
	<label>
		Description
		<textarea
			{...updateLabelDetails.fields.labelDescription.as('text')}
			value={labelDescription}
			disabled={!!updateLabelDetails.pending}
		></textarea>
	</label>
	{#each updateLabelDetails.fields.labelDescription.issues() as issue}
		<div class="issue">{issue.message}</div>
	{/each}
	<label>
		Website
		<input
			{...updateLabelDetails.fields.labelWebsite.as('text')}
			value={labelWebsite}
			disabled={!!updateLabelDetails.pending}
		/>
	</label>
	{#each updateLabelDetails.fields.labelWebsite.issues() as issue}
		<div class="issue">{issue.message}</div>
	{/each}
	<button type="submit" disabled={!!updateLabelDetails.pending} data-sveltekit-reload>
		{updateLabelDetails.pending ? 'Updating...' : 'Update profile'}
	</button>
</form>
