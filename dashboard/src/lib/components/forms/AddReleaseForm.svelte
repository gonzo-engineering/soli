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
		<input {...addRelease.fields.releaseName.as('text')} />
	</label>
	<label>
		Artwork image file
		<input {...addRelease.fields.releaseArtwork.as('file')} />
	</label>
	<label>
		Type
		<select {...addRelease.fields.releaseType.as('select')}>
			<option value="album">Album</option>
			<option value="ep">EP</option>
			<option value="single">Single</option>
		</select>
	</label>
	<label>
		Genres
		<select {...addRelease.fields.releaseGenres.as('select multiple')} multiple>
			{#each genres as genre}
				<option value={genre}>{genre}</option>
			{/each}
		</select>
	</label>
	<label>
		Release date
		<input {...addRelease.fields.releaseDate.as('date')} />
	</label>
	<button type="submit">Add Release</button>
</form>
