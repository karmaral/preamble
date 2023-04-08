<script lang="ts">
  import { tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import { updateSetting } from '$lib/middleware';
  import { settings } from '$stores';
  import { ModalBackdrop } from '$features/ui';

  let isRenaming = false;
  let elemRef: HTMLElement;

  let rootElem: HTMLDivElement;

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
    rootElem.style.zIndex = '100';
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

    setTimeout(() => rootElem.style.zIndex = null, 300);
  }
</script>

<div class="greeting" bind:this={rootElem}>
  {#if isRenaming}
    <ModalBackdrop />
  {/if}
  {#if nameLoaded}
    <div class="greeting-text"
      transition:fade={{ duration: 400 }}
    >
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
    </div>
  {/if}
</div>

<style>
  .greeting {
    position: relative;
  }
  .greeting-text {
    font-size: 4rem;
    font-weight: 300;
    line-height: 1;
  }
  .greeting-text > span {
    display: inline-flex;
    position: relative;
    z-index: 1;
    user-select: text;
  }
  .greeting-text > span:focus-visible {
    outline: none;
  }
  .greeting-text > span::before {
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
  .greeting-text > span.active::before {
    visibility: visible;
    opacity: 1;
    transition-delay: 0s;
  }
  .greeting-text > span.active::after {
    content: ".";
    position: absolute;
  }
</style>
