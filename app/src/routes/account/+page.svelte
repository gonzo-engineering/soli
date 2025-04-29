<script lang="ts">
	import { enhance } from '$app/forms';
	import { userState } from '$lib/global-state/index.svelte.js';
	import { prettifyBalance } from '$lib/utils/index.js';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let data;
	export let form;

	let { session, supabase, profileData } = data;
	$: ({ session, supabase, profileData } = data);

	let profileForm: HTMLFormElement;
	let loading = false;
	let fullName: string = profileData?.full_name ?? '';
	let username: string = profileData?.username ?? '';
	let website: string = profileData?.website ?? '';
	let tokensBalance: number = profileData?.tokens_balance ?? 0;
	let payPerStream: number = profileData?.pay_per_stream ?? 3;

	let topUpAmount: number = 0;

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};
</script>

<div class="form-widget">
	<h2>Your details</h2>
	<form
		class="form-widget"
		method="post"
		action="?/update"
		use:enhance={handleSubmit}
		bind:this={profileForm}
	>
		<div>
			<label for="email">Email</label>
			<input id="email" type="text" value={session.user.email} disabled />
		</div>

		<div>
			<label for="fullName">Full Name</label>
			<input id="fullName" name="fullName" type="text" value={form?.fullName ?? fullName} />
		</div>

		<div>
			<label for="username">Username</label>
			<input id="username" name="username" type="text" value={form?.username ?? username} />
		</div>

		<div>
			<label for="website">Website</label>
			<input id="website" name="website" type="url" value={form?.website ?? website} />
		</div>

		<div>
			<label for="payPerStream">Pay Per Stream</label>
			<input
				id="payPerStream"
				name="payPerStream"
				type="range"
				min="1"
				max="5"
				step="1"
				value={form?.payPerStream ?? payPerStream}
				placeholder="1p minimum, default 3p"
			/>
		</div>

		<div>
			<input
				type="submit"
				class="button block primary"
				value={loading ? 'Loading...' : 'Update'}
				disabled={loading}
			/>
		</div>
	</form>
</div>

<hr />

<div>
	<h3>Balance</h3>
	{#key userState.liveBalance}
		<div>
			{prettifyBalance(userState.liveBalance ? userState.liveBalance : tokensBalance)} tokens
		</div>
	{/key}
	<div>
		At your current rate of {payPerStream} tokens per stream, you can stream {Math.floor(
			(userState.liveBalance ? userState.liveBalance : tokensBalance) / payPerStream
		)} more songs before needing to top up.
	</div>
	<form method="post" action="?/topup" use:enhance={handleSubmit}>
		<div>
			<input
				type="number"
				name="amount"
				min="1"
				max="1000"
				step="1"
				placeholder="Top up amount"
				value={topUpAmount}
			/>
		</div>
		<div>
			<input
				type="submit"
				class="button block primary"
				value={loading ? 'Loading...' : 'Top Up'}
				disabled={loading}
			/>
		</div>
	</form>
</div>

<hr />

<form method="post" action="?/signout" use:enhance={handleSignOut}>
	<div>
		<button class="button block" disabled={loading}>Sign Out</button>
	</div>
</form>

<style>
	hr {
		margin: 2rem 0;
	}
</style>
