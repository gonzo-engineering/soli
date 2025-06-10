<script>
  import "../../../shared/styles/reset.css";
  import { dashboardState } from "$lib/state.svelte";

  let { children, data } = $props();

  const artists = $derived(data.artists);
</script>

<div class="dashboard-container">
  <div class="side-panel">
    <h1>Soli • Dashboard</h1>
    <hr />
    {#if artists}
      <h2>Artists</h2>
      {#each artists as artist}
        <div
          class="artist-selector"
          onclick={() => {
            if (dashboardState.activeArtist?.id !== artist.id) {
              dashboardState.activeArtist = artist;
            } else {
              dashboardState.activeArtist = null;
            }
          }}
          onkeydown={() => (dashboardState.activeArtist = artist)}
          tabindex="0"
          role="button"
          class:active={dashboardState.activeArtist?.id === artist.id}
        >
          {artist.name}
        </div>
      {/each}
    {:else}
      <li>No artists found.</li>
    {/if}
  </div>
  <main>
    {@render children()}
  </main>
</div>

<style>
  .dashboard-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }
  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }
  h2 {
    padding: 0.5rem;
  }
  .artist-selector {
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }
  .side-panel {
    width: 350px;
    color: white;
    background-color: #313131;
    padding: 2rem;
  }
  main {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
  }
  .active {
    background-color: #444;
    color: white;
    transition: background-color 0.2s ease;
  }
</style>
