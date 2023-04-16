<script lang="ts">
  import type { SettingsOption } from "$types";

  export let key = '';
  export let label = '';
  export let value = '';

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
    {label}
    <input
      type="text"
      name="{key}"
      id=""
      {value}
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
    border: 1px solid hsl(0 0% 100% / 8%);
    border-radius: .2rem;
    background: none;
    font-size: 1rem;
    font-family: inherit;
    box-shadow: none;
    color: hsl(0 0% 100% / 70%);
    transition: all .2s;
  }
  input:focus-visible {
    outline: none;
    color: hsl(0 0% 100% / 90%);
    border-color: hsl(0 0% 100% / 20%);
    box-shadow: inset 0 0 2em -1em hsl(0deg 0% 0% / 50%);
  }
</style>
