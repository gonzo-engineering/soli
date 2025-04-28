<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from '../$types';

	let { form }: { form: ActionData } = $props();

	let uploading = $state(false);

	function handleUpload() {
		uploading = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			uploading = false;
		};
	}
</script>

<main>
	<div class="upload-form">
		<h2>Upload a song</h2>
		<form method="POST" enctype="multipart/form-data" use:enhance={handleUpload}>
			<input type="file" id="file" name="fileToUpload" accept=".mp3" />
			<label for="file">Choose an MP3 file</label>
			<input type="text" name="title" placeholder="Title" required />
			<input type="text" name="artist" placeholder="Artist" required />
			<input type="text" name="release" placeholder="Release" />
			<button disabled={uploading} type="submit">
				{uploading ? 'Uploading...' : 'Upload'}
			</button>
		</form>
		{#if form && form.status === 200}
			<p>File uploaded successfully!</p>
		{/if}
	</div>
</main>

<style>
	.upload-form {
		text-align: center;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 300px;
		margin: auto;
	}
</style>
