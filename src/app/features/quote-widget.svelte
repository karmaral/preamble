<script lang="ts">
  import { dailyQuote } from "$stores";

  $: loaded = Boolean($dailyQuote);

  function isLarge(quoteText: string) {
    const words = quoteText.split(' ');
    return words.length > 30;
  }
  $: large = loaded && isLarge($dailyQuote.text);

</script>

{#if loaded}
  <div class="quote-widget">
    <div class="wrap">
      <div class="content" class:large>
        <div class="quote">
          "{$dailyQuote.text}"
        </div>
        <div class="author">
          {$dailyQuote.author}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .quote-widget {
    transition: all .4s;
    font-size: 1.3rem;
    width: fit-content;
    display: flex;
  }
  .quote-widget:hover .content {
    transform: translateY(-1em);
  }
  .quote-widget:hover .author {
    opacity: .7;
  }
  .wrap {
    all: unset;
    cursor: pointer;
    padding: 2rem;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform .5s;
    position: relative;
  }
  .content.large { font-size: .9em; }
  .author {
    opacity: 0;
    position: absolute;
    bottom: -.4rem;
    transform: translateY(100%);
    transition: all .5s;
    display: flex;
    gap: 1em;
  }
</style>
