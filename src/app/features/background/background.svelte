<script lang="ts">
  import { photos, isBackgroundChanging } from 'src/app/stores';

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
      $isBackgroundChanging = false;
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
  <div class="bg-overlay"></div>
</div>

<style>
  .background {
    position: fixed;
    inset: 0;
    background: var(--backdrop-color);
    z-index: 0;
  }
  .bg-overlay {
    position: absolute;
    inset: 0;
    background-image: url('../bg-overlay.png');
    background-size: cover;
    background-position: center;
    mix-blend-mode: multiply;
    z-index: 2;
    transition: opacity .5s;
  }
  img {
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
