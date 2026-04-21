<script lang="ts">
	import { API_BASE } from '$lib/config';

	const {
		artistId,
		artistName,
		artistGroup
	}: { artistId: string; artistName: string; artistGroup: string } = $props();

	let isLoading = $state(false);
	let error = $state<string | null>(null);

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		isLoading = true;
		error = null;

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		try {
			const response = await fetch(`${API_BASE}/tracks`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const data = await response.json();
				error = data.error ?? 'Upload failed';
				return;
			}

			form.reset();
		} catch (err) {
			error = 'Upload failed — please try again';
		} finally {
			isLoading = false;
		}
	};
</script>

<h3>Upload Track</h3>

{#if error}
	<p class="error">{error}</p>
{/if}

<form onsubmit={handleSubmit} enctype="multipart/form-data">
	<input type="hidden" name="artistId" value={artistId} />
	<input type="hidden" name="artistName" value={artistName} />
	<input type="hidden" name="artistGroup" value={artistGroup} />
	<label>
		Track audio file
		<input type="file" name="audioFile" disabled={isLoading} />
	</label>
	<label>
		Title
		<input type="text" name="title" disabled={isLoading} />
	</label>
	<button type="submit" disabled={isLoading}>
		{isLoading ? 'Uploading...' : 'Upload Track'}
	</button>
</form>
