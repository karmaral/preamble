<script lang="ts">
  import { tick } from 'svelte';

  let name = 'Amaral';

  let isRenaming = false;
  let elemRef: HTMLElement;

  let renameAction = console.log

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
    renameAction(elemRef.innerText);
  }
</script>

<div class="greeting">
  Hello,
  <div
    class:active={isRenaming}
    contenteditable={isRenaming}
    on:click={handleRename}
    on:blur={handleSubmit}
    on:keydown={handleKeys}
    bind:this={elemRef}
  >
    <span>{name}</span>
  </div>
</div>

<style>
  .greeting {
    font-size: 4rem;
    font-weight: 300;
    line-height: 1;
  }
  .greeting > div {
    display: inline-flex;
    position: relative;
    user-select: text;
  }
  .greeting > div:focus-visible {
    outline: none;
  }
  .greeting > div::before {
    content: "";
    width: calc(100% + .3em);
    height: calc(100% + .3em);
    position: absolute;
    background-color: hsl(0 0% 0% / 8%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    backdrop-filter: blur(10px);
    border-radius: .5rem;
    border-bottom:2px solid;
    visibility: hidden;
  }
  .greeting > div.active::before {
    visibility: visible;
  }
  span {
    all: unset;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    line-height: inherit;
    position: relative;
  }
</style>
