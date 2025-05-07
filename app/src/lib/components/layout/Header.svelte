<script>
	let { userIsLoggedIn } = $props();
</script>

<header>
	<div class="section"></div>
	<div class="section">
		<a href="/" class="logo">
			<img src="/soli-logo-full-white.png" class="icon" alt="Soli emblem" />
		</a>
	</div>
	<div class="section">
		<div>
			{#if userIsLoggedIn}
				<a href="/account">Account</a>
			{:else}
				<a href="/login">Login</a>
			{/if}
		</div>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 1rem;
		a {
			text-decoration: none;
			color: inherit;
		}
	}
	.section {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.section:first-child > div {
		margin-right: auto;
	}

	.section:last-child > div {
		margin-left: auto;
	}
	.icon {
		height: 50px;
	}
</style>
