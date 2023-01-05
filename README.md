# Preamble - A new tab extension for Chrome
An extension for having a pleasant sight-seeing experience before embarking on your browsing journeys.
## The goal
This was meant as an attempt to clone the Momentum extension, and see how far I could get by just using free API's.

The only caveat is that it will require you to have [a developer key for using the Unsplash API]().
The weather is handled by requesting for `geolocation` and using [OpenMeteo](https://open-meteo.org), and the quotes are obtained from [They Said So](https://theysaidso.com).

## Disclaimer
Since this project was both for practice and for filling a very specific *UI quirk* need, the main purpose of the app is achieved. 
A clock, a daily quote, the weather and the ability to change background. 

The rest of the features are in a skeleton stage. This means the settings don't do much other than being pretty.

## Thanks
Thanks to the Svelte's Discord user Corrl who shed light on how to graciously enhance the crossfading implementation.

------

This extension uses the [Svelte Typescript Chrome Extension Boilerplate](https://github.com/NekitCorp/chrome-extension-svelte-typescript-boilerplate)
