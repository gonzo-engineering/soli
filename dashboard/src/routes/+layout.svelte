<script>
  import "../../../shared/styles/reset.css";
</script>

<div class="dashboard-container">
  <div class="side-panel">
    <h1>Soli • Dashboard</h1>
  </div>
  <main>
    <slot />
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
  .side-panel {
    width: 350px;
    text-align: center;
    color: white;
    background-color: #313131;
    padding: 1rem;
  }
  main {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
  }
</style>
