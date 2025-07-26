<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<div class="card">
  {@render children()}
</div>

<style>
  .card {
    color: var(--color-background);
    background-color: var(--color-text);
    line-height: 1.1;
    padding: 0.5rem;
    margin: 0.5rem 0;
    border-radius: 5px;
    box-shadow: var(--box-shadow);
  }
</style>
