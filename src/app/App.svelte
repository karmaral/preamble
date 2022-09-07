<script lang="ts">
  import './app.css';
  import { requestNewBackground } from '@lib/middleware';
  import Background from '@features/background';
  import Clock from '@features/clock.svelte';

</script>

<main>
  <Background />
  <div class='layout'>
    <div class='layout-content'>
      <Clock />
      <div class='greeting'><span>Hello, Amaral</span></div>

      <button on:click={requestNewBackground}>New background</button>
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: white;
    background:
      radial-gradient(rgb(0 0 0 / 70%) -20%, transparent 30%),
      radial-gradient(transparent 80%, rgb(0 0 0 / 51%) 125%);
    gap: 1em;
  }
  .greeting {
    font-size: 4rem;
    font-weight: 300;
    line-height: 1;
  }
  button {
    all: unset;
    cursor: pointer;
    padding: 1rem;
    background-color: rgb(0 0 0 / 25%);
    border-radius: 2em;
    display: flex;
    flex-direction: column;
  }
  button:hover {
    background-color: rgb(0 0 0 / 40%);
  }
</style>
