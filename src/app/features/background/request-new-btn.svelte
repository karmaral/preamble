<script lang="ts">
  import { requestNewBackground } from '$lib/middleware';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { ArrowPath } from '@steeze-ui/heroicons';
  import { isBackgroundChanging } from '$stores';

  $: waiting = $isBackgroundChanging;

  async function handleRequest(){
    $isBackgroundChanging = true;
    requestNewBackground();
  }
</script>

<button
  class="btn-request btn-ui-big"
  class:waiting
  on:click={handleRequest}
>
  <Icon src={ArrowPath} size={"1em"} stroke-width={"1"} />
</button>

<style>
  :global(.btn-request.waiting svg){
    animation: rotateAnim 2s linear infinite;
  }
  @keyframes rotateAnim {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

</style>
