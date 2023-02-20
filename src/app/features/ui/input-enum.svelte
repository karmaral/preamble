<script lang="ts">
  import type { SettingsOption } from 'src/types';
  import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@rgossiaux/svelte-headlessui';

  export let options: SettingsOption[] = [{
    label: 'Default',
    value: 'default',
  }];
  // export let callback = (value: string) => {};

  let selected = options[0].value;

  function handleChange(e: CustomEvent) {
    console.log('Changed', e.detail);
    // callback(value: string);
    selected = e.detail;
  }
</script>

<div class="ui-input-enum">
  <RadioGroup
    class="group"
    value={selected}
    on:change={handleChange}
  >
    {#each options as option (option.value)}
      <RadioGroupOption
        value={option.value}
        class="option {selected === option.value ? 'selected' : ''}"
      >
        <RadioGroupLabel>{option.label}</RadioGroupLabel>
      </RadioGroupOption>
    {/each}
  </RadioGroup>
</div>

<style>
  .ui-input-enum {
    display: flex;
    font-size: 14px;
  }
  :global(.ui-input-enum > .group) {
    display: flex;
    background-color: rgb(0 0 0 / 15%);
    border-radius: var(--border-radius-s);
    border: 1px solid rgb(255 255 255 / .08);
  }
  :global(.ui-input-enum .option) {
    cursor: pointer;
    padding: .5rem 1rem;
    border-radius: var(--border-radius-s);
    transition: box-shadow .2s, background-color .2s;
  }
  :global(.ui-input-enum .option > *) { cursor: pointer; }
  :global(.ui-input-enum .option.selected) {
    font-weight: 500;
    background-color: rgb(255 255 255 / 33%);
    box-shadow: 0 0 .4em -.4em rgb(0 0 0 / 40%);
  }
</style>
