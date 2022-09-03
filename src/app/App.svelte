<script lang="ts">
  import Background from '@features/background';

</script>

<main>
  <Background />
  <div class='layout'>
    <div class='layout-content'>
      <h1>Lobby</h1>

    </div>

  </div>
</main>

<style>
  .layout {
    position: fixed;
    inset: 0;
    z-index: 1;
  }
  .layout-content {
    display: flex;
  }
</style>
