<script lang="ts">
  import type { SettingsOption } from "$types";

  export let key = '';
  export let label = '';
  export let value = '';
  export let placeholder = '';

  export let onChange: (opt: SettingsOption) => void;

  let elemRef: HTMLInputElement;

  function handleSubmit() {
    const opt = { value: elemRef.value, label };
    onChange(opt);
  }

  function handleKeys(e: KeyboardEvent) {
    if (['Enter', 'Escape'].includes(e.key)){
      elemRef.blur();
    }
  }
</script>

<div class="ui-input-text">
  <label for="{key}">
    <span>{label}</span>
    <input
      type="text"
      name="{key}"
      id=""
      {value}
      {placeholder}
      bind:this={elemRef}
      on:keydown={handleKeys}
      on:blur={handleSubmit}
    >
  </label>
</div>

<style>
  label {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    font-size: 12px;
    font-weight: normal;
  }
  input {
    padding: .5rem;
    width: 80%;
    border: 1px solid transparent;
    border-radius: .2rem;
    background: none;
    font-size: 1.1rem;
    font-family: inherit;
    font-weight: 300;
    box-shadow: none;
    color: hsl(0 0% 100% / 70%);
    transition: all .2s;
  }
  input:focus-visible {
    outline: transparent;
    color: hsl(0 0% 100% / 90%);
    border-color: hsl(0 0% 100% / 15%);
    box-shadow: inset 0 0 2em -1em hsl(0deg 0% 0% / 50%);
  }
  input::placeholder {
    color: inherit;
    opacity: .4;
  }
</style>
