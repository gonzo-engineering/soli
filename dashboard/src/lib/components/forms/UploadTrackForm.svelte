<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { API_BASE } from '$lib/config';
	import { supabase } from '$lib/supabase';
	import { parseBlob } from 'music-metadata';

	const {
		artistId
	}: {
		artistId: string;
	} = $props();

	let isLoading = $state(false);
	let error = $state<string | null>(null);

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		isLoading = true;
		error = null;

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const audioFile = formData.get('audioFile') as File;
		const title = formData.get('title') as string;

		if (!audioFile || !title) {
			error = 'Please fill in all fields';
			isLoading = false;
			return;
		}

		try {
			// Parse duration client-side
			let durationSeconds = 0;
			try {
				const metadata = await parseBlob(audioFile);
				durationSeconds = Math.round(metadata.format.duration ?? 0);
			} catch {
				console.warn('Could not parse audio duration');
			}

			// Create track record and get signed upload URL
			const prepareResponse = await fetch(`${API_BASE}/tracks/upload-url`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ artistId, title, durationSeconds })
			});

			if (!prepareResponse.ok) {
				const data = await prepareResponse.json();
				error = data.error ?? 'Failed to prepare upload';
				return;
			}

			const { token, fileName } = await prepareResponse.json();

			// Upload directly to Supabase from the browser
			const { error: storageError } = await supabase.storage
				.from('tracks')
				.uploadToSignedUrl(fileName, token, audioFile);

			if (storageError) {
				error = 'File upload failed — please try again';
				return;
			}

			form.reset();
			invalidateAll();
		} catch (err) {
			error = 'Upload failed — please try again';
			console.error(err);
		} finally {
			isLoading = false;
		}
	};
</script>

<h3>Upload Track</h3>

{#if error}
	<p class="error">{error}</p>
{/if}

<form onsubmit={handleSubmit}>
	<label>
		Track audio file
		<input type="file" name="audioFile" accept="audio/*" disabled={isLoading} />
	</label>
	<label>
		Title
		<input type="text" name="title" disabled={isLoading} />
	</label>
	<button type="submit" disabled={isLoading}>
		{isLoading ? 'Uploading...' : 'Upload Track'}
	</button>
</form>
