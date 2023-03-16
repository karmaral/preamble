<script lang="ts">
  import { tick } from 'svelte';

  import { updateSetting } from '$lib/middleware';
  import { settings } from '$stores';

  let isRenaming = false;
  let elemRef: HTMLElement;

  let renameAction = updateSetting;

  $: nameLoaded = $settings?.user_name;
  $: name = $settings?.user_name?.value || 'nameless person!';
  function handleKeys(e: KeyboardEvent): void {
    if (!isRenaming) return;
    if (e.key === 'Enter' || e.key === 'Escape') {
      elemRef.blur();
    }
  }

  async function handleRename(e: MouseEvent): Promise<void> {
    e.preventDefault();
    isRenaming = true;
    await tick();
    elemRef.focus();
  }

  async function handleSubmit(): Promise<void> {
    isRenaming = false;
    await tick();
    window.getSelection().removeAllRanges();
    if (name === elemRef.innerText) return;
    const payload = {
      key: 'user_name',
      label: '',
      value: elemRef.innerText,
    };
    renameAction(payload);
  }
</script>

<div class="greeting">
  {#if nameLoaded}
    Hello,
    <span
      class:active={isRenaming}
      contenteditable={isRenaming}
      on:click={handleRename}
      on:blur={handleSubmit}
      on:keydown={handleKeys}
      bind:this={elemRef}
    >
      {name}
    </span>
  {/if}
</div>

<style>
  .greeting {
    font-size: 4rem;
    font-weight: 300;
    line-height: 1;
  }
  .greeting > span {
    display: inline-flex;
    position: relative;
    z-index: 1;
    user-select: text;
  }
  .greeting > span:focus-visible {
    outline: none;
  }
  .greeting > span::before {
    content: "";
    width: calc(100% + .3em);
    height: calc(100% + .3em);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    backdrop-filter: blur(10px);
    border-radius: .5rem;
    visibility: hidden;
    opacity: 0;
    transition:opacity .3s, visibility 0s;
    transition-delay: 0s, .3s;
    box-shadow: 0 0 1.2em hsl(0 0% 0% / 45%);
    z-index: -1;
  }
  .greeting > span.active::before {
    visibility: visible;
    opacity: 1;
    transition-delay: 0s;
  }
</style>
