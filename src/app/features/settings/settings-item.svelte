<script lang="ts">
  import type { SettingsItem, SettingsOption } from 'src/types';
  import { InputEnum, InputSelect, InputSlider, InputText } from '$features/ui';
  import { updateSetting } from '$lib/middleware';


  export let data : SettingsItem;
  let {
    item_key,
    title,
    description,
    input_label,
    input_type,
  } = data;

  let customActive = false;
  let customData;

  function handleSelectChange(opt:SettingsOption) {
    const { value, label } = opt;
    const payload = { key: item_key, value, label }
    updateSetting(payload);
    console.log(payload);
    customActive = opt.custom;
  }

</script>

<div
  class="settings-item"
  class:vertical={data?.direction === 'vertical' }
>
  <div class="item-info">
    <h3>{title}</h3>
    {#if description}
      <p class="description">{description} </p>
    {/if}
    {#if customActive}
      <div class="custom">
        <InputText key={item_key} label={input_label} />
      </div>
    {/if}
  </div>
  <div class="item-action">
    {#if input_type === 'enum'}
      <InputEnum options={data.options}/>
    {:else if input_type === 'select'}
      <InputSelect options={data.options} onChange={handleSelectChange} />
    {:else if input_type === 'range'}
      <InputSlider />
    {:else}
      <InputText key={item_key} label={input_label} type={input_type} />
    {/if}
  </div>
</div>

<style>
  .settings-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-block: 1.2rem;
    border-bottom: 1px solid rgb(255 255 255 / 10%);
  }
  .settings-item.vertical {
    flex-direction: column;
    align-items: stretch;
  }
  .settings-item:first-child { padding-block-start: .5rem; }

  .item-info {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  h3 {
    margin-block: 0;
    font-weight: 500;
  }
  .description {
    font-size: 14px;
    color: rgb(255 255 255 / 70%);
    white-space: pre-line;
    margin-block: .2rem 0;
  }
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
    transition: all .2s;
  }
  input:focus-visible {
    outline: none;
    border-bottom-color: rgb(255 255 255 / 70%);
    background-color: rgb(0 0 0 / 15%);
  }
</style>
