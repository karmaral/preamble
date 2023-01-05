<script lang="ts">
  import { isEmpty } from 'lodash-es';
  import { photos, isBackgroundChanging } from 'src/app/stores';
  import { ArrowTopRightOnSquare } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';

  $: data = $photos[0];
  $: loaded = !isEmpty(data);

</script>

{#if loaded}

  <div class="author-widget" class:hide={$isBackgroundChanging}>
    <a href={data.url} alt="unsplash image link" target="_blank" >
      <div class="content">
        <div class="location">{data.location}</div>
        <div class="author-name">
          {data.user_name}
          <Icon src={ArrowTopRightOnSquare} size={"1em"} />
        </div>
      </div>
    </a>
  </div>
{/if}

<style>
  .author-widget {
    transition: all .4s;
    font-weight: 300;
    font-size: .9rem;
    width: fit-content;
    display: flex;
  }
  .author-widget:hover .content {
    transform: translateY(-50%);
  }
  .author-widget:hover .author-name {
    opacity: .5;
  }
  a {
    all: unset;
    cursor: pointer;
    padding: 2rem;
    min-width: 10rem;
  }
  .content {
    display: flex;
    flex-direction: column;
    transition: transform .5s;
  }
  .hide {
    opacity: 0;
    transform: translateY(1em);
  }

  .author-name {
    margin-top: .2rem;
    opacity: 0;
    position: absolute;
    transform: translateY(100%);
    transition: all .5s;
    display: flex;
    align-items: center;
    gap: .5em;
  }

</style>
