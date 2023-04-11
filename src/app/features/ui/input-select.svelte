<script lang="ts">
  import { tick } from 'svelte';
  import type { SettingsOption } from '$types';
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from "@rgossiaux/svelte-headlessui";
  import { Svroller } from 'svrollbar';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { ChevronDown } from '@steeze-ui/heroicons';
  import { cls } from '$lib/utils';


  export let options: SettingsOption[] = [
    {
      label: 'Default',
      value: 'default',
    },
  ];

  let currentValue = options[0].value;
  $: selectedOption = options.find((o) => o.value === currentValue);

  export let onChange: (opt: SettingsOption) => void;

  async function handleChange(e: CustomEvent) {
    currentValue = e.detail;
    await tick();
    onChange(selectedOption);
  }

  function classNames({ active, selected }) {
    const obj = { 'option': true, active, selected };
    return cls(obj);
  }

</script>

<div class="ui-input-select">
  <Listbox
    value={currentValue}
    on:change={handleChange}
  >
    <ListboxButton class="option-button">
      {selectedOption?.label}
      <Icon src={ChevronDown} size="1em" stroke-width="1" />
    </ListboxButton>
    <ListboxOptions class="option-list">
      <Svroller>
        {#each options as option (option.value)}
          {@const value = `${option.value}`}
          <ListboxOption
            {value}
            class={classNames}
          >
            {option.label}
          </ListboxOption>
        {/each}
      </Svroller>
    </ListboxOptions>
  </Listbox>
</div>

<style>
  .ui-input-select {
    display: flex;
    font-size: 14px;
    position: relative;
    width: 10rem;
  }
  :global(.ui-input-select > div) {
    width: 100%;
  }
  :global(.ui-input-select .option-button) {
    all: unset;
    padding: .5rem 1rem;
    border-radius: var(--border-radius-s);
    border: 1px solid rgb(255 255 255 / .08);
    cursor: pointer;
    text-align: left;
    width: -webkit-fill-available;
    width: fill-available;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  :global(.ui-input-select .option-list) {
    list-style: none;
    margin-block: 0;
    padding-inline: 0;
    overflow: hidden;
    width: 100%;
    height: 10rem;
    background-color: rgb(0 0 0 / .2);
    border-radius: var(--border-radius-s);
    border: 1px solid rgb(255 255 255 / .08);
    position: absolute;
    transform: translateY(.4rem);
    box-shadow: 0 1.2em 1.3em -0.8em rgb(0 0 0 / .3);
  }
  :global(.ui-input-select .option) {
    cursor: pointer;
    padding: .5rem 1rem;
    background-color: rgb(0 0 0 / 15%);
    transition: background-color .2s;
  }
  :global(.ui-input-select .option.active) {
    background-color: rgb(255 255 255 / 3%);
  }
  :global(.ui-input-select .option.selected) {
    font-weight: 500;
    background-color: rgb(255 255 255 / 33%);
  }

</style>
