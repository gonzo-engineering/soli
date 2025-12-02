<script lang="ts">
	import Vinyl from '$lib/components/icons/Vinyl.svelte';
	import Cassette from '$lib/components/icons/Cassette.svelte';
	import Heart from '$lib/components/icons/Heart.svelte';

	let { menuIsOpen = $bindable(), session }: { menuIsOpen: boolean; session: any } = $props();

	const menuLinks = [
		{
			section: 'Browse',
			links: [
				{ href: '/releases', label: 'Releases' },
				{ href: '/artists', label: 'Artists' },
				{ href: '/genres', label: 'Genres' }
			]
		},
		{
			section: 'My library',
			links: [
				{ href: '/me/collections', label: 'Collections' },
				{ href: '/me/mixtapes', label: 'Mixtapes' },
				{ href: '/me/liked-tracks', label: 'Liked tracks' }
			]
		},
		{
			section: 'Misc',
			links: [
				{ href: '/me', label: 'Account' },
				{ href: '/about', label: 'About' }
			]
		}
	];
</script>

<nav>
	<ul>
		{#if session}
			{#each menuLinks as section}
				<div class="nav-section">
					<span class="section-title">{section.section}</span>
					{#each section.links as link}
						<li>
							<a href={link.href} onclick={() => (menuIsOpen = !menuIsOpen)}>
								{#if link.label === 'Collections'}
									<span class="icon"><Vinyl /></span>
								{:else if link.label === 'Mixtapes'}
									<span class="icon"><Cassette /></span>
								{:else if link.label === 'Liked tracks'}
									<span class="icon"><Heart filled /></span>
								{/if}
								{link.label}
							</a>
						</li>
					{/each}
				</div>
			{/each}
		{:else}
			<li><a href="/login" onclick={() => (menuIsOpen = !menuIsOpen)}>Login</a></li>
		{/if}
	</ul>
</nav>

<style>
	.nav-section {
		margin-bottom: 2rem;
	}
	.section-title {
		font-weight: 600;
		text-transform: uppercase;
		margin: 1rem 0 0.5rem 0;
	}
	ul {
		list-style: none;
		padding: 1rem;
		margin: 0;
	}
	li {
		margin: 0.5rem 0;
	}
	a {
		text-decoration: none;
		color: var(--color-text);
		font-size: 1.4rem;
	}
	a:hover {
		opacity: 0.8;
	}
	.icon {
		margin-right: 0.4rem;
	}
</style>
