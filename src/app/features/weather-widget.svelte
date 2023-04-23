<script lang="ts">
  import { format } from 'date-fns';
  import {
    DaySunny, NightClear,
    DayCloudy, NightAltCloudy,
    DayShowers, NightAltShowers,
    DayThunderstorm, NightAltThunderstorm,
    DayFog, NightFog,
    DayRain, NightAltRain,
    DaySnow, NightAltSnow,
  } from 'svelte-weather';
  import { currentWeather } from '$stores';

  $: loaded = ('text' in $currentWeather);
  $: ({ temperature, text, text_long, city } = $currentWeather);

  const icons = {
    'Clear': [DaySunny, NightClear],
    'Clouds': [DayCloudy, NightAltCloudy],
    'Drizzle': [DayShowers, NightAltShowers],
    'Thunderstorm': [DayThunderstorm, NightAltThunderstorm],
    'Rain': [DayRain, NightAltRain],
    'Snow': [DaySnow, NightAltSnow],
    'Fog': [DayFog, NightFog],
  };

  function getIcon(text: string): unknown | null {
    if (text in icons) {
      const d = new Date($currentWeather.time);
      const period = format(d,'B');
      const isNight = period.includes('night') || period.includes('evening');

      return icons[text][Number(isNight)];
    }
    return null;
  }

  function getRoundedTemp(t: number) {
    return Math.round(t * 10) / 10;
  }

</script>

{#if loaded}
  <div class="weather-widget">
    <div class="temperature">
      <span class="icon">
        <svelte:component this={getIcon(text)} size="1em"/>
      </span>
      {getRoundedTemp(temperature)}°
    </div>
    <div class="city">
      {city}
    </div>
    <div class="description">
      {text_long}
    </div>
  </div>
{/if}

<style>
  .weather-widget {
    display: flex;
    flex-direction: column;
    text-align: right;
  }
  .temperature {
    display: flex;
    gap: .2rem;
    justify-content: flex-end;
    align-items: center;
    font-size: 1.7rem;
    font-weight: 400;
    letter-spacing: -1px;
  }
  .icon {
    display: flex;
  }
  .city {
    font-size: 1.1rem;
  }
  .description {
    font-size: .9rem;
    line-height: 1;
    opacity: .7;
  }
</style>
