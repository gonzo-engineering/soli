<script lang="ts">
	import { enhance } from '$app/forms';
	import { userState } from '$lib/global/state.svelte.js';
	import { REVENUE_SPLIT } from '$lib/global/config.js';
	import { prettifyBalance, prettifyPennies } from '$lib/utils/index.js';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let data;
	export let form;

	let { session, supabase, profileData } = data;
	$: ({ session, supabase, profileData } = data);

	let profileForm: HTMLFormElement;
	let loading = false;
	let firstName: string = profileData?.first_name ?? '';
	let tokensBalance: number = profileData?.tokens_balance ?? 0;
	let payPerStream: number = profileData?.pay_per_stream ?? 3;

	$: topUpAmount = 0;

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

	const checkout = async () => {
		const data = await fetch('/api/checkout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId: session.user.id,
				balance: tokensBalance,
				topUpAmount
			})
		}).then((data) => data.json());
		window.location.replace(data.url);
	};
</script>

<h2>Hi, {data.profileData?.first_name}</h2>
<div class="form-widget">
	<h3>Details and settings</h3>
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
			<label for="firstName">First Name</label>
			<input id="firstName" name="firstName" type="text" value={form?.firstName ?? firstName} />
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
		At your chosen rate of {payPerStream} tokens per stream you can stream {Math.floor(
			(userState.liveBalance ? userState.liveBalance : tokensBalance) / payPerStream
		)} more songs before needing to top up again.
	</div>
	<h3>Top up</h3>
	<div>
		<div>
			<input
				type="number"
				name="amount"
				min="30"
				max="1000"
				step="1"
				placeholder="Top up amount"
				bind:value={topUpAmount}
			/>
		</div>
		<div>
			{prettifyPennies(Math.round(topUpAmount * REVENUE_SPLIT.artists))} goes to
			{Math.round(topUpAmount * REVENUE_SPLIT.artists)} tokens,
			{prettifyPennies(topUpAmount * REVENUE_SPLIT.platform)} goes to us
		</div>
		<button on:click={checkout}>Top up</button>
	</div>
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
