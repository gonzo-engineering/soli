<script lang="ts">
	import { API_BASE } from '$lib/config';
	import { supabase } from '$lib/supabase';
	import { parseBlob } from 'music-metadata';

	const {
		artistId,
		onTrackUploaded
	}: {
		artistId: string;
		onTrackUploaded: (title: string) => void;
	} = $props();

	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let isDragging = $state(false);
	let selectedFile = $state<File | null>(null);
	let titleInput = $state('');

	const uploadFile = async (audioFile: File, title: string) => {
		let durationSeconds = 0;
		try {
			const metadata = await parseBlob(audioFile);
			durationSeconds = Math.round(metadata.format.duration ?? 0);
		} catch {
			console.warn('Could not parse audio duration');
		}

		const prepareResponse = await fetch(`${API_BASE}/tracks/upload-url`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ artistId, title, durationSeconds })
		});

		if (!prepareResponse.ok) {
			const data = await prepareResponse.json();
			throw new Error(data.error ?? 'Failed to prepare upload');
		}

		const { token, fileName } = await prepareResponse.json();

		const { error: storageError } = await supabase.storage
			.from('tracks')
			.uploadToSignedUrl(fileName, token, audioFile);

		if (storageError) throw new Error('File upload failed — please try again');
	};

	const selectFile = (file: File | undefined | null) => {
		if (!file) return;
		if (!file.type.startsWith('audio/')) {
			error = 'Please choose an audio file';
			return;
		}
		error = null;
		selectedFile = file;
		// Pre-fill title from filename if empty
		if (!titleInput) {
			titleInput = file.name.replace(/\.[^/.]+$/, '');
		}
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		isLoading = true;
		error = null;

		const title = titleInput.trim();

		if (!selectedFile || !title) {
			error = 'Please choose a file and enter a title';
			isLoading = false;
			return;
		}

		try {
			await uploadFile(selectedFile, title);
			selectedFile = null;
			titleInput = '';
			onTrackUploaded(title);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Upload failed — please try again';
			console.error(err);
		} finally {
			isLoading = false;
		}
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		isDragging = true;
	};

	const handleDragLeave = () => {
		isDragging = false;
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		isDragging = false;
		selectFile(e.dataTransfer?.files[0]);
	};
</script>

<h3>Upload Track</h3>

{#if error}
	<p class="error">{error}</p>
{/if}

<form onsubmit={handleSubmit}>
	<div
		class="drop-zone"
		class:dragging={isDragging}
		class:has-file={selectedFile}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		role="region"
		aria-label="Audio file drop zone"
	>
		{#if selectedFile}
			<p>{selectedFile.name}</p>
			<button type="button" onclick={() => (selectedFile = null)} disabled={isLoading}>
				Remove
			</button>
		{:else}
			<div>Drag and drop an audio file here</div>
			<div>or</div>
			<label class="file-input-label">
				Browse
				<input
					type="file"
					accept="audio/*"
					disabled={isLoading}
					onchange={(e) => {
						selectFile(e.currentTarget.files?.[0]);
						// Allow re-selecting the same file after removing it
						e.currentTarget.value = '';
					}}
				/>
			</label>
		{/if}
	</div>
	<label>
		Title
		<input type="text" bind:value={titleInput} disabled={isLoading} />
	</label>
	<button type="submit" disabled={isLoading}>
		{isLoading ? 'Uploading...' : 'Upload Track'}
	</button>
</form>

<style>
	.drop-zone {
		border: 2px dashed var(--color-accent, #888);
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;
		cursor: default;
	}
	.drop-zone.dragging {
		border-color: var(--color-text, white);
		background-color: rgba(255, 255, 255, 0.05);
	}
	.drop-zone.has-file {
		border-style: solid;
		border-color: var(--color-accent, #888);
	}
	.file-input-label {
		display: inline-block;
		cursor: pointer;
		padding: 0.4rem 1rem;
		border: 1px solid var(--color-accent, #888);
		border-radius: 4px;
	}
	.file-input-label input {
		display: none;
	}
</style>
