<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
  } from "@rgossiaux/svelte-headlessui";
  import { Icon } from '@steeze-ui/svelte-icon';
  import { XMark } from '@steeze-ui/heroicons';
  import SettingsContent from './settings-content.svelte';

  export let isOpen = false;
  export let handleClose : any;
</script>

{#if isOpen}
  <Dialog
    open={isOpen}
    on:close={handleClose}
    class="modal"
    static
  >
    <div transition:fade={{duration: 300}}>
      <DialogOverlay class="modal-backdrop"/>
    </div>
    <div class="modal-container">
        <div class="panel"
          in:fly={{ y: 25, duration: 400}}
          out:fly={{ y: 25, duration: 400}}
        >
          <div class="panel-header">
            <DialogTitle>Settings</DialogTitle>
            <button class="btn-close" on:click={handleClose} >
                <Icon src={XMark} size={"1em"}/>
            </button>
          </div>
          <SettingsContent />
        </div>
    </div>
  </Dialog>
{/if}

<style>
  :global(.modal) {
    position: relative;
      z-index: 50;
  }
  :global(.modal-backdrop) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:rgb(0 0 0 / 15%);
  }
  .modal-container {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    inset: 50% 0 50% 0;
  }
  .panel {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 55rem;
    min-height: 30rem;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 4.5em 6em -3em  rgb(0 0 0 / 30%);
    background-color: rgb(0 0 0 /30%);
    backdrop-filter: blur(0.6rem);
    border: 1px solid;
    border-color: rgb(0 0 0 / 15%);
    border-radius: 1rem;
    color: white;
  }
  .panel-header {
    display: flex;
    padding-bottom: .5rem;
  }
  :global(.panel-header > h2) {
    flex-grow: 1;
    font-weight: 300;
    font-size: 3em;
    margin-block: 1rem;
  }
  .btn-close {
    all: unset;
    padding: .8rem;
    font-size: 2rem;
    display: flex;
    align-self: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    position: absolute;
    top: .5rem;
    right: .5rem;
    transition: all .3s;
  }

</style>
