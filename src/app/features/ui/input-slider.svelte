<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips';

  /**
   * Holds the slider value when it changes.
  */
  export let value: Number = -1;

  function handleChange(e: CustomEvent) {
    value = e.detail.value;
  }

</script>

<div class="ui-input-slider">
  <RangeSlider
    springValues={{ stiffness: 1, damping: 1 }}
    on:change={handleChange}
  />
</div>

<style>
  .ui-input-slider {
    display: flex;
  }
  :global(.item-action .rangeSlider) {
    margin: 0;
    --slider: rgb(0 0 0 / 40%);
    --handle-inactive: rgb(255 255 255 / 33%);
    --handle-focus: rgb(255 255 255 / 70%);
    --handle-border: rgb(255 255 255  / 15%);
    border: 1px solid rgb(255 255 255 / 0.08); /* Turn into var later*/
    border-radius: var(--border-radius-s);
    height: 1.6rem;
    min-width: 10rem;
  }
  :global(.item-action .rangeSlider .rangeHandle) {
    top: 50%;
  }
  :global(.rangeSlider .rangeNub, .rangeSlider .rangeHandle:before) {
    border-radius: var(--border-radius-s);
  }
</style>
