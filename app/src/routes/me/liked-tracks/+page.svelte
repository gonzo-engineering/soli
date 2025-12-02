<script lang="ts">
	import BreadcrumbLinks from '$lib/components/layout/BreadcrumbLinks.svelte';
	import TracksTable from '$lib/components/releases/TracksTable.svelte';

	let { data } = $props();

	// TODO: Handle this upstream, maybe defer to the most recent parent release
	// If there are multiple tracks with the same ID, we only want to show one
	const uniqueTrackIds = new Set();
	data.likedTracks = data.likedTracks.filter((track) => {
		if (uniqueTrackIds.has(track.id)) {
			return false;
		} else {
			uniqueTrackIds.add(track.id);
			return true;
		}
	});
</script>

<svelte:head>
	<title>My liked tracks · Soli</title>
	<meta name="description" content="Browse your liked tracks on Soli." />
</svelte:head>

<BreadcrumbLinks breadcrumbs={[{ link: '/me', label: 'Me' }]} />

<h2>My liked tracks</h2>

<TracksTable tracks={data.likedTracks} showReleaseAndArtist={true} />
