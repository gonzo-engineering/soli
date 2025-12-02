<script lang="ts">
	import { userState } from '$lib/global/state.svelte.js';
	import { prettifyBalance, prettifyPennies } from '$lib/utils/index';
	import ContentBlock from '$lib/components/ContentBlock.svelte';
	import { tokensCheckout, updateUserSettings } from '$lib/remote-functions/user.remote';
	import { signOut } from '$lib/remote-functions/login.remote';

	let { data } = $props();

	let { profileData } = $state(data);

	let firstName: string = profileData?.first_name ?? '';
	let tokensBalance: number = profileData?.tokens_balance ?? 0;

	let tokensTopUpAmount = $state(50);

	const makeTopUpMessage = (numberOfTokens: number) => {
		const tokensFee = numberOfTokens;
		const soliCut = Math.round(tokensFee * 0.1);
		return `Cost: ${prettifyPennies(
			tokensFee + soliCut
		)} (${prettifyPennies(tokensFee)} for the tokens and ${prettifyPennies(soliCut)} for Soli.)`;
	};
</script>

<svelte:head>
	<title>Me · Soli</title>
	<meta name="description" content="Your settings and account details." />
</svelte:head>

<ContentBlock>
	<h2>Me</h2>
	<div class="form-widget">
		<h3>Details and settings</h3>
		<form {...updateUserSettings.enhance(({ submit }) => submit())}>
			<label>
				First name
				<input {...updateUserSettings.fields.firstName.as('text')} value={firstName} />
			</label>
			<label>
				Pay per stream (tokens)

				<input
					{...updateUserSettings.fields.payPerStream.as('number')}
					value={profileData?.pay_per_stream ?? 3}
					min="1"
					max="5"
				/>
			</label>
			<button type="submit">Update settings</button>
			{#if updateUserSettings.result?.success}
				<div style="color: lightgreen;">Settings updated successfully!</div>
			{/if}
		</form>
	</div>

	<hr />

	<div>
		<h3>My library</h3>
		<ul>
			<li>
				<a href="/me/collections">Collections</a>
			</li>
			<li>
				<a href="/me/mixtapes">Mixtapes</a>
			</li>
			<li>
				<a href="/me/liked-tracks">Liked tracks</a>
			</li>
		</ul>
	</div>

	<hr />

	<div>
		<h3>Balance</h3>
		{#key userState.liveBalance}
			<div class="balance-amount">
				{prettifyBalance(userState.liveBalance ? userState.liveBalance : tokensBalance)} tokens
			</div>
		{/key}
		<p>
			At your chosen rate of <span class="bold"
				>{data.profileData.pay_per_stream} tokens per stream</span
			>
			you can stream
			<span class="bold"
				>{Math.floor(
					(userState.liveBalance ? userState.liveBalance : tokensBalance) /
						data.profileData.pay_per_stream
				)}</span
			> more songs before needing to top up again.
		</p>
		<h4>Top up</h4>
		<form>
			<label>
				Add
				<input
					type="number"
					name="amount"
					min="30"
					max="1000"
					step="1"
					placeholder="Top up amount"
					bind:value={tokensTopUpAmount}
				/> tokens
			</label>
			<p>{makeTopUpMessage(tokensTopUpAmount)}</p>
			<button
				onclick={() =>
					tokensCheckout({
						balance: tokensBalance,
						topUpAmount: Math.round(tokensTopUpAmount * 1.1)
					}).then(({ url }) => {
						window.location.href = url;
					})}>Top up</button
			>
		</form>
	</div>

	<hr />

	<button
		onclick={() => {
			signOut().then(() => {
				location.reload();
			});
		}}>Sign Out</button
	>
</ContentBlock>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	input,
	button {
		border-radius: 0.5rem;
		padding: 0.2rem 0.5rem;
	}
	.balance-amount {
		font-size: 1.4rem;
		font-weight: 600;
		margin: 0.5rem 0;
	}
	.bold {
		font-weight: 600;
	}
	button:hover {
		opacity: 0.8;
		cursor: pointer;
	}
	hr {
		margin: 2rem 0;
	}
</style>
