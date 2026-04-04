<script lang="ts">
	import { sendCode, verifyCode } from '$lib/remote-functions/login.remote';

	let stage: 'enterEmail' | 'enterCode' = $derived(
		sendCode.result?.success ? 'enterCode' : 'enterEmail'
	);
</script>

<svelte:head>
	<title>Login • Soli</title>
</svelte:head>

<div class="wrapper">
	<h2>Log in</h2>
	{#if !sendCode.result}
		<div>
			Enter your email to log in. If you are not registered as part of the beta this will not work. <a
				href="/contact">Get in touch</a
			> if you would like to join.
		</div>
	{:else if sendCode.result?.success}
		<div>
			A 6-digit code was sent to <strong>{sendCode.result.email}</strong>. Please enter it below to
			log in.
		</div>
	{/if}

	{#if !sendCode.result?.success === false && sendCode.result?.message}
		<div style="color: lightgreen;">{sendCode.result.message}</div>
	{/if}

	{#if sendCode.result?.success === false && sendCode.result?.message}
		<div style="color: lightcoral;">{sendCode.result.message}</div>
	{/if}

	{#if stage === 'enterEmail'}
		<form {...sendCode}>
			<input {...sendCode.fields.email.as('email')} />
			<button type="submit">Send code</button>
		</form>
	{/if}

	{#if stage === 'enterCode' && sendCode.result?.email}
		<form {...verifyCode}>
			<input {...verifyCode.fields.email.as('hidden', sendCode.result.email)} />
			<input {...verifyCode.fields.code.as('text')} />
			<button type="submit">Verify code</button>
		</form>
	{/if}
</div>

<style>
	.wrapper {
		max-width: 400px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		line-height: 1.1;
	}
	h2 {
		margin: 0;
		line-height: 1;
	}
	input,
	button {
		border-radius: 0.5rem;
		padding: 0.5rem;
		margin: 0 0.5rem 0 0 0;
	}
</style>
