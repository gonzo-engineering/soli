<script lang="ts">
	import { API_BASE } from '$lib/config';
	import { supabase } from '$lib/supabase';
	import { parseBlob } from 'music-metadata';

	const {
		artistId,
		onTracksUploaded
	}: {
		artistId: string;
		onTracksUploaded: (count: number, allDone: boolean) => void;
	} = $props();

	type UploadItem = {
		id: string;
		file: File;
		title: string;
		status: 'pending' | 'uploading' | 'done' | 'error';
		error?: string;
	};

	const CONCURRENCY = 3;

	let items = $state<UploadItem[]>([]);
	let error = $state<string | null>(null);
	let isDragging = $state(false);
	let isUploading = $state(false);

	const queueable = $derived(items.filter((i) => i.status === 'pending' || i.status === 'error'));

	const addFiles = (files: FileList | File[] | null | undefined) => {
		if (!files) return;
		const all = Array.from(files);
		const audio = all.filter((f) => f.type.startsWith('audio/'));
		const skipped = all.length - audio.length;

		error = skipped > 0 ? `${skipped} non-audio file${skipped > 1 ? 's' : ''} skipped` : null;

		for (const file of audio) {
			items.push({
				id: crypto.randomUUID(),
				file,
				title: file.name.replace(/\.[^/.]+$/, ''),
				status: 'pending'
			});
		}
	};

	const removeItem = (id: string) => {
		items = items.filter((i) => i.id !== id);
	};

	const uploadItem = async (item: UploadItem) => {
		item.status = 'uploading';
		item.error = undefined;
		let trackId: string | undefined;

		try {
			let durationSeconds = 0;
			try {
				const metadata = await parseBlob(item.file);
				durationSeconds = Math.round(metadata.format.duration ?? 0);
			} catch {
				console.warn('Could not parse audio duration for', item.file.name);
			}

			const prepareResponse = await fetch(`${API_BASE}/tracks/upload-url`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ artistId, title: item.title.trim(), durationSeconds })
			});

			if (!prepareResponse.ok) {
				const data = await prepareResponse.json().catch(() => ({}));
				throw new Error(data.error ?? 'Failed to prepare upload');
			}

			const prepared = await prepareResponse.json();
			trackId = prepared.trackId;

			const { error: storageError } = await supabase.storage
				.from('tracks')
				.uploadToSignedUrl(prepared.fileName, prepared.token, item.file);

			if (storageError) throw new Error('File upload failed');

			item.status = 'done';
		} catch (err) {
			item.status = 'error';
			item.error = err instanceof Error ? err.message : 'Upload failed';
			console.error(err);

			// The API creates the track row before the file arrives, so remove it
			// on failure to avoid orphaned rows (and duplicates when retrying)
			if (trackId) {
				await fetch(`${API_BASE}/tracks/${trackId}`, { method: 'DELETE' }).catch(() => {});
			}
		}
	};

	const runQueue = async (queue: UploadItem[]) => {
		let next = 0;
		const worker = async () => {
			while (next < queue.length) {
				const item = queue[next++];
				await uploadItem(item);
			}
		};
		await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		error = null;

		if (queueable.some((i) => !i.title.trim())) {
			error = 'Every track needs a title';
			return;
		}

		const queue = [...queueable];
		if (queue.length === 0) return;

		isUploading = true;
		await runQueue(queue);
		isUploading = false;

		const succeeded = queue.filter((i) => i.status === 'done').length;

		// Keep only failures in the list so they can be retried
		items = items.filter((i) => i.status !== 'done');

		if (succeeded > 0) {
			onTracksUploaded(succeeded, items.length === 0);
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
		addFiles(e.dataTransfer?.files);
	};

	const statusLabel = (item: UploadItem) => {
		switch (item.status) {
			case 'uploading':
				return 'Uploading...';
			case 'done':
				return 'Done';
			case 'error':
				return item.error ?? 'Failed';
			default:
				return 'Ready';
		}
	};
</script>

<h3>Upload Tracks</h3>

{#if error}
	<p class="error">{error}</p>
{/if}

<form onsubmit={handleSubmit}>
	<div
		class="drop-zone"
		class:dragging={isDragging}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		role="region"
		aria-label="Audio file drop zone"
	>
		<div>Drag and drop audio files here</div>
		<div>or</div>
		<label class="file-input-label">
			Browse
			<input
				type="file"
				accept="audio/*"
				multiple
				disabled={isUploading}
				onchange={(e) => {
					addFiles(e.currentTarget.files);
					// Allow re-selecting the same files after removing them
					e.currentTarget.value = '';
				}}
			/>
		</label>
	</div>

	{#if items.length > 0}
		<ul class="items">
			{#each items as item (item.id)}
				<li class="item" class:failed={item.status === 'error'} class:done={item.status === 'done'}>
					<div class="item-file">{item.file.name}</div>
					<div class="item-row">
						<input
							type="text"
							aria-label={`Title for ${item.file.name}`}
							bind:value={item.title}
							disabled={isUploading || item.status === 'done'}
						/>
						<button
							type="button"
							onclick={() => removeItem(item.id)}
							disabled={item.status === 'uploading'}
						>
							Remove
						</button>
					</div>
					<small class="status">{statusLabel(item)}</small>
				</li>
			{/each}
		</ul>
	{/if}

	<button type="submit" disabled={isUploading || queueable.length === 0}>
		{#if isUploading}
			Uploading...
		{:else if queueable.length === 0}
			Upload
		{:else}
			Upload {queueable.length} track{queueable.length > 1 ? 's' : ''}
		{/if}
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
	.items {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.75rem;
		border: 1px solid var(--color-border, #444);
		border-radius: 6px;
	}
	.item.failed {
		border-color: rgb(255, 162, 162);
	}
	.item.done {
		opacity: 0.6;
	}
	.item-file {
		font-size: 0.8rem;
		opacity: 0.7;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.item-row {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	.status {
		font-size: 0.75rem;
	}
	.item.failed .status {
		color: rgb(255, 162, 162);
	}
	.error {
		color: rgb(255, 162, 162);
	}
</style>
