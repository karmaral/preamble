<script lang="ts">
  import { isEmpty } from 'lodash-es';
  import { photos, isBackgroundChanging } from 'src/app/stores';

  $: data = $photos[0];
  $: loaded = !isEmpty(data);
  $: location = `${data?.location_city}, ${data?.location_country}`;

</script>

{#if loaded}
  <div class="author-widget" class:hide={$isBackgroundChanging}>
    <div class="location">{location}</div>
    <div class="author-name">
      <a href={data.url} alt="unsplash image link" target="_blank">
        {data?.user_name}
      </a>
    </div>
  </div>
{/if}

<style>
  .author-widget {
    display: flex;
    flex-direction: column;
    transition: all .4s;
    font-size: .8em;
    font-weight: 300;
  }
  .hide {
    opacity: 0;
    transform: translateY(-1em);
  }
  :global(.author-name > a){
    all: unset;
    cursor: pointer;
  }

</style>
