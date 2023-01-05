<script lang="ts">
  import { format } from 'date-fns';
  import {
    DaySunny, NightClear,
    DayCloudy, NightCloudy,
    DaySunnyOvercast,
    DayFog, NightFog,
    DayRain, NightAltRain,
  } from 'svelte-weather';
  import { currentWeather } from 'src/app/stores';
  $: loaded = Boolean($currentWeather);

  const icons = {
    0: [DaySunny, NightClear],
    1: [DaySunny, NightClear],
    2: [DayCloudy, NightCloudy],
    3: [DaySunnyOvercast],
    45: [DayFog, NightFog],
    48: ['Depositing rime fog'],
    51: ['Light drizzle'],
    53: ['Moderate drizzle'],
    55: ['Dense drizzle'],
    56: ['Light, freezing drizzle'],
    57: ['Dense, freezing drizzle'],
    61: [DayRain, NightAltRain],
    63: [DayRain, NightAltRain],
    65: [DayRain, NightAltRain],
    66: ['Light freezing rain'],
    67: ['Heavy freezing rain'],
    71: ['Slight snowfall'],
    73: ['Moderate snowfall'],
    75: ['Heavy snowfall'],
    77: ['Snow grains'],
    80: ['Slight rain showers'],
    81: ['Moderate rain showers'],
    82: ['Violent rain showers'],
  };


  function getIcon(code: number) {
    if (code in icons) {
      const d = new Date($currentWeather.time);
      const period = format(d,'B');
      const isNight = period.includes('night') || period.includes('evening');
      if (!(typeof icons[code][0] === 'string')) {
        if (isNight && icons[code][1]) {
          return icons[code][1];
        }
          return icons[code][0];
      }
    }
    return null;
  }


</script>

{#if loaded}
  <div class="weather-widget">
    <div class="temperature">
      <span class="icon">
        <svelte:component this={getIcon($currentWeather.weathercode)} size={"1em"}/>
      </span>
      {$currentWeather.temperature}°
    </div>
    <div class="text">
      {$currentWeather.text}
    </div>
  </div>
{/if}

<style>

.weather-widget {
  display: flex;
  flex-direction: column;
  gap: .1rem;
  text-align: right;
}
.temperature {
  display: flex;
  gap: .2rem;
  justify-content: flex-end;
  align-items: center;
  font-size: 1.7rem;
}
.icon {
  display: flex;
}
.text {
  font-size: 1.1rem;
}

</style>
