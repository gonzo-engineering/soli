<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    children,
    onClickFunction,
  }: {
    children: Snippet;
    onClickFunction: () => void;
  } = $props();
</script>

<button onclick={onClickFunction}>
  {@render children()}
</button>

<style>
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: var(--color-text-secondary);
    &:hover {
      opacity: 0.7;
    }
  }
</style>
