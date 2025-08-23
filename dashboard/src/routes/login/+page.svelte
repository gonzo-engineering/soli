<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, SubmitFunction } from "./$types.js";

  export let form: ActionData;

  let loading = false;
  import { fail, redirect } from "@sveltejs/kit";
  import type { Actions, PageServerLoad } from "./$types";

  export const load: PageServerLoad = async ({
    url,
    locals: { safeGetSession },
  }) => {
    const { session } = await safeGetSession();

    if (session) {
      redirect(303, "/");
    }

    return { url: url.origin };
  };

  export const actions: Actions = {
    default: async (event) => {
      const {
        url,
        request,
        locals: { supabase },
      } = event;
      const formData = await request.formData();
      const email = formData.get("email") as string;
      const validEmail = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email);

      if (!validEmail) {
        return fail(400, {
          errors: { email: "Please enter a valid email address" },
          email,
        });
      }

      const { error } = await supabase.auth.signInWithOtp({ email });

      if (error) {
        return fail(400, {
          success: false,
          email,
          message: `There was an issue, Please contact support.`,
        });
      }

      return {
        success: true,
        message:
          "Please check your email for a magic link to log into the website.",
      };
    },
  };
  const handleSubmit: SubmitFunction = () => {
    loading = true;
    return async ({ update }) => {
      update();
      loading = false;
    };
  };
</script>

<svelte:head>
  <title>Login • Soli Dashboard</title>
</svelte:head>

<form method="POST" use:enhance={handleSubmit}>
  <div class="wrapper">
    <h2>Log in</h2>
    <div class="description">
      If you're part of the experiment, you can sign in via magic link with your
      email below.
    </div>
    {#if form?.message !== undefined}
      <div class="success {form?.success ? '' : 'fail'}">
        {form?.message}
      </div>
    {/if}
    <div>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Your email"
        value={form?.email ?? ""}
      />
    </div>
    {#if form?.errors?.email}
      <span>
        {form?.errors?.email}
      </span>
    {/if}
    <div>
      <button>
        {loading ? "Loading" : "Send magic link"}
      </button>
    </div>
  </div>
</form>

<style>
  .wrapper {
    max-width: 400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  h2 {
    margin: 0;
    line-height: 1;
  }
  .description {
    line-height: 1.3;
    margin-bottom: 0;
  }
  input,
  button {
    border-radius: 0.5rem;
    padding: 0 0.5rem;
  }
</style>
