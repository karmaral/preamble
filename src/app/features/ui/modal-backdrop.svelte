<script lang="ts">
  import { fade } from 'svelte/transition';

</script>

<div class="modal-backdrop"
 transition:fade={{ duration: 300 }}
>
  <slot />
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: var(--focus-overlay-background);
  }
  .modal-backdrop > :global(*){
    width: 100%;
    height: 100%;
  }
</style>
