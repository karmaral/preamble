<script lang="ts">

  export let key = '';
  export let label = '';
  export let value = '';

</script>

<div class="ui-input-text">
  <label for="{key}">
    {label}
    <input type="text" name="{key}" id="" {value} on:change>
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
    border: none;
    border-bottom: 1px solid rgb(255 255 255 / 30%);
    border-radius: .2rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    background: none;
    font-size: 1rem;
    font-family: inherit;
    color: white;
    transition: all .2s;
  }
  input:focus-visible {
    outline: none;
    border-bottom-color: rgb(255 255 255 / 70%);
    background-color: rgb(0 0 0 / 15%);
  }
</style>
