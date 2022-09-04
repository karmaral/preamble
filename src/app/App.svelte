<script lang="ts">
  import './app.css';
  import { requestNewBackground } from '@lib/middleware';
  import Background from '@features/background';


function printDate(){
  const now = new Date();
  const hours = now.getHours();
  const mins = now.getMinutes();
  const hh = String(hours).padStart(2, '0');
  const mm = String(mins).padStart(2, '0');

  return `${hh}:${mm}`;
}

</script>

<main>
  <Background />
  <div class='layout'>
    <div class='layout-content'>
      <div class='time'><span>{printDate()}</span></div>
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
  .time {
    font-size: 11rem;
  }
  .greeting {
    font-size: 4rem;
  }
  .time,.greeting {
    font-weight: 500;
    line-height: 1;
  }
  button {
    all: unset;
    cursor: pointer;
    padding: 1rem;
    background-color: rgb(0 0 0 / 25%);
    border-radius: 2em;
  }
  button:hover {
    background-color: rgb(0 0 0 / 40%);
  }
</style>
