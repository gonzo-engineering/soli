<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    popupMenuOpen = $bindable(),
  }: { children: Snippet; popupMenuOpen: boolean } = $props();
</script>

<div class="popup-menu-wrapper">
  {@render children()}
  <button onclick={() => (popupMenuOpen = false)}>Close</button>
</div>

<style>
  .popup-menu-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid gray;
    padding: 1rem;
    border-radius: 4px;
    background-color: var(--color-background);
    box-shadow: var(--box-shadow);
    width: 90%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
