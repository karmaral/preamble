<script lang="ts">
  import { dailyQuote } from "src/app/stores";

  $: loaded = Boolean($dailyQuote);

</script>

{#if loaded}
  <div class="quote-widget">
    <div class="wrap">
      <div class="content">
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
    font-size: 1.1rem;
    width: fit-content;
    display: flex;
  }
  .quote-widget:hover .content {
    transform: translateY(-70%);
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
    transition: transform .5s;
  }
  .author {
    margin-top: .2rem;
    opacity: 0;
    position: absolute;
    transform: translateY(100%);
    transition: all .5s;
    display: flex;
    gap: 1em;
  }
</style>
