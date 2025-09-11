<script lang="ts">
  import type { SubmitFunction } from "@sveltejs/kit";
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  let { form }: { form?: ActionData } = $props();

  let stage: "enterEmail" | "enterCode" = $derived(
    form?.success ? "enterCode" : "enterEmail"
  );

  let loading = $state(false);

  const handleSubmit: SubmitFunction = () => {
    loading = true;
    return async ({ update }) => {
      update();
      loading = false;
    };
  };
</script>

<svelte:head>
  <title>Login • Soli</title>
</svelte:head>

<div class="wrapper">
  <h2>Log in</h2>
  {#if stage === "enterEmail"}
    <div>Enter your email to receive a one-time code.</div>
  {:else if stage === "enterCode" && form?.email}
    <div>
      A 6-digit code was sent to <strong>{form.email}</strong>. Please enter it
      below to log in.
    </div>
  {/if}

  {#if form?.success === false && form?.message}
    <div style="color: red;">{form.message}</div>
  {/if}

  {#if stage === "enterEmail"}
    <form method="POST" action="?/sendCode" use:enhance={handleSubmit}>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Sending…" : "Send code"}
      </button>
    </form>
  {/if}

  {#if stage === "enterCode" && form?.email}
    <form method="POST" action="?/verifyCode" use:enhance={handleSubmit}>
      <input type="hidden" name="email" value={form.email} />
      <input
        id="code"
        name="code"
        type="text"
        inputmode="numeric"
        maxlength="6"
        placeholder="123456"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Verifying…" : "Verify code"}
      </button>
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
