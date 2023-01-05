<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import type { SettingsData } from 'src/types';
  import _data from './settings-data';
  import SettingsItem from './settings-item.svelte';

  let data: SettingsData = _data;
  let dataKeys = Object.keys(data);

  let activeTab: string = dataKeys[0];

  function handleSetActive(key: string) {
    activeTab = key;
  }
</script>

<div class="container">
  <div class="content">
    <div class="tabs">
      {#each dataKeys as key (key)}
        <div class="tab"
          class:active={key === activeTab}
          on:click={() => handleSetActive(key)}
        >
          {data[key].label}
        </div>
      {/each}
    </div>
    <div class="enforce-transition">
      {#each dataKeys as key (key)}
        {#if key === activeTab}
          <div class="tabs-content"
            in:fly|local={{ y: 5, duration: 200, delay: 120 }}
            out:fade|local={{ duration: 120 }}
          >
              {#each data[activeTab].settings as entry (entry.item_key)}
                <SettingsItem data={entry} />
              {/each}
          </div>
          {/if}
      {/each}
    </div>
  </div>

</div>

<style>
  .content {
    display: flex;
    align-items: flex-start;
  }
  .tabs {
    width: 25%;
    border-right: 2px solid rgb(255 255 255 / 20%);
  }
  .tab {
    padding: .5rem;
    font-weight: 300;
    cursor: pointer;
    background-color: rgb(0 0 0 / 10%);
    transition: box-shadow .2s, background-color .2s;
  }
  .tab:first-child { border-top-left-radius: .2rem; }
  .tab:last-child { border-bottom-left-radius: .2rem; }

  .tab:hover {
    background-color: rgb(0 0 0 / 5%);
  }
  .tab.active {
    font-weight: 500;
    background-color: rgb(255 255 255 / 12%);
    box-shadow: 0 0 .4em -.4em rgb(0 0 0 / 40%);
  }
  .tabs-content {
    width: 100%;
    padding-left: 2rem;
  }
  .enforce-transition {
    display: grid;
    width: 100%;
  }
  :global(.enforce-transition > *) {
    grid-column: 1/2;
    grid-row: 1/2;
  }
</style>
