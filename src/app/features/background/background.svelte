<script lang="ts">
  import { photos } from 'src/app/stores';

  const CROSSFADE_TIME = 2000;
  const INITIAL_FADE_TIME = 600;

  async function handleTransition(event: Event) {
    const image = event.target as HTMLImageElement;
    if (!image) return;

    const isSingle = $photos.length === 1;
    const duration = isSingle ? INITIAL_FADE_TIME : CROSSFADE_TIME;

    const animation = image.animate(
      [{ opacity: 1 }],
      { duration, fill: 'forwards' },
    );

    await animation.finished;

    if (!isSingle) {
      $photos = $photos.slice(1);
    }
  }

</script>

<div class="background">
  {#if $photos.length}
    {#each $photos as photo (photo.id)}
      <img
        on:load={handleTransition}
        src={photo.src}
        alt={photo.alt_description}
      >
    {/each}
  {/if}
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
    position: absolute;
  }
</style>
