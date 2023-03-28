declare namespace preamble  {
  interface weather {
    init(initParams: { geolocation: GeolocationCoordinates }): Promise<void>
  }
}
