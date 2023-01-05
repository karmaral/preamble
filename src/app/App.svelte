<script lang="ts">
  import './app.css';
  import { settingsOpen } from 'src/app/stores';
  import Background, { RequestButton, AuthorWidget } from '$features/background';
  import {
    ClockWidget,
    QuoteWidget,
    WeatherWidget,
    } from '$features';
  import SettingsModal from '$features/settings';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { Cog6Tooth } from '@steeze-ui/heroicons';

  const handleToggleSettings = (toggle : boolean) => $settingsOpen = toggle;
</script>

<main>
  <Background />
  <div class="layout">
    <div class="top-row">
      <div class="top-left-content"></div>
      <div class="top-center-content"></div>
      <div class="top-right-content">
        <WeatherWidget />
      </div>

    </div>
    <div class="center-content">
      <ClockWidget />
      <div class="greeting"><span>Hello, Amaral</span></div>
    </div>

    <div class="bottom-row">
      <div class="bottom-left-content">
        <AuthorWidget />
      </div>
      <div class="bottom-center-content">
        <QuoteWidget />
      </div>
      <div class="bottom-right-content">
        <RequestButton />
        <button
          class="btn-ui-big btn-settings"
          class:open={$settingsOpen}
          on:click={() => handleToggleSettings(true)}
        >
          <Icon src={Cog6Tooth} size={"1em"} stroke-width={"1"} />
        </button>
      </div>
    </div>

  </div>
  <SettingsModal isOpen={$settingsOpen} handleClose={() => handleToggleSettings(false)}/>
</main>

<style>
  .layout {
    position: fixed;
    inset: 0;
    color: white;
    z-index: 5;
    animation: fadeIn .8s;
    animation-fill-mode: backwards;
  }
  .center-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 1em;
  }
  .greeting {
    font-size: 4rem;
    font-weight: 300;
    line-height: 1;
  }

  .top-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    transition: opacity 0.23s cubic-bezier(0.4, 0, 1, 1);
  }
  .top-row > div { flex-basis: 33%; }
  .top-right-content {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 2rem;
  }
  .bottom-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    transition: opacity 0.23s cubic-bezier(0.4, 0, 1, 1);
  }
  .bottom-left-content { flex-basis: 33%; }
  .bottom-center-content {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40vmin;
    flex-basis: 90%;
  }
  .bottom-right-content {
    padding: 2rem;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    min-width: 16vmin;
    flex-direction: column;
    flex-basis: 33%;
  }
  .btn-settings.open {
    transform: rotate(30deg);
  }
</style>
