<script lang="ts">
  import type { BackgroundPhoto } from 'src/types';
  import { bgData as photo } from 'src/app/stores';


  console.log('background.svelte');


  let loaded = false;

</script>

<div class="background" class:loaded >
    <!-- <img class='previous'
      on:load|once={() => loaded = true}
      src={photo?.src}
      alt={photo?.alt_description}
    > -->
    <img class='current'
      on:load|once={() => loaded = true}
      src={$photo?.src}
      alt={$photo?.alt_description}
    >
</div>

<style>
  .background {
    position: fixed;
    inset: 0;
    background: white;
    z-index: 0;
  }
  img {
    opacity: 0;
    transition: opacity .8s;
  }
  .loaded img { opacity: 1; }
</style>
