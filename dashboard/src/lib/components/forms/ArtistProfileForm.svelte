<script lang="ts">
	import { updateArtistDetails } from '$lib/remote-functions/artist.remote';
	import { makeImageLink } from '$lib/utils';

	let {
		artistId,
		artistName,
		currentArtistImageCID,
		artistBio,
		artistWebsite,
		artistLinks = []
	}: {
		artistId: string;
		artistName: string;
		currentArtistImageCID?: string;
		artistBio?: string;
		artistWebsite?: string;
		artistLinks?: string[];
	} = $props();

	const pending = $derived(!!updateArtistDetails.pending);

	let links = $state([...artistLinks]);
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
	{...updateArtistDetails.enhance(async ({ submit }) => {
		updateArtistDetails.fields.artistLinks.set(JSON.stringify(links));
		await submit();
	})}
	enctype="multipart/form-data"
	class:pending
>
	<input {...updateArtistDetails.fields.artistId.as('hidden', artistId)} />
	<input {...updateArtistDetails.fields.artistName.as('hidden', artistName)} />
	<input {...updateArtistDetails.fields.artistLinks.as('hidden', JSON.stringify(links))} />

	{#if currentArtistImageCID}
		<div>
			<img src={makeImageLink(currentArtistImageCID, 300)} alt="Current Artist Profile" />
		</div>
	{/if}
	<label>
		Change profile image
		<input {...updateArtistDetails.fields.artistImageNew.as('file')} disabled={pending} />
	</label>
	<label>
		Bio
		<textarea
			{...updateArtistDetails.fields.artistBio.as('text')}
			value={artistBio}
			disabled={pending}
		></textarea>
	</label>
	{#each updateArtistDetails.fields.artistBio.issues() as issue}
		<div class="issue">{issue.message}</div>
	{/each}
	<label>
		Website
		<input
			{...updateArtistDetails.fields.artistWebsite.as('text')}
			value={artistWebsite}
			disabled={pending}
		/>
	</label>
	{#each updateArtistDetails.fields.artistWebsite.issues() as issue}
		<div class="issue">{issue.message}</div>
	{/each}

	<div class="links-section">
		Additional links (Instagram, Bandcamp, TikTok, etc.)
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
