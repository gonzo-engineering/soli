<script lang="ts">
	import { addRelease } from '$lib/remote-functions/music.remote';
	import { genres } from '$lib/utils';

	const { artistId }: { artistId: string } = $props();
</script>

<h3>Add Release</h3>

<form {...addRelease} enctype="multipart/form-data">
	<input {...addRelease.fields.artistId.as('hidden', artistId)} />
	<label>
		Title
		<input {...addRelease.fields.releaseName.as('text')} disabled={!!addRelease.pending} />
	</label>
	<label>
		Artwork image file
		<input {...addRelease.fields.releaseArtwork.as('file')} disabled={!!addRelease.pending} />
	</label>
	<label>
		Type
		<select {...addRelease.fields.releaseType.as('select')} disabled={!!addRelease.pending}>
			<option value="album">Album</option>
			<option value="ep">EP</option>
			<option value="single">Single</option>
		</select>
	</label>
	<label>
		Genres
		<select
			{...addRelease.fields.releaseGenres.as('select multiple')}
			multiple
			disabled={!!addRelease.pending}
		>
			{#each genres as genre}
				<option value={genre}>{genre}</option>
			{/each}
		</select>
	</label>
	<label>
		Release date
		<input {...addRelease.fields.releaseDate.as('date')} disabled={!!addRelease.pending} />
	</label>
	<button type="submit" disabled={!!addRelease.pending}>
		{addRelease.pending ? 'Adding...' : 'Add Release'}
	</button>
</form>
