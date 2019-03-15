exports.config = Object.assign({}, require('./chrome').config, {
  // Docker for Mac host address:
  hostname: 'host.docker.internal',
  // Appium port:
  port: 4723,
  // Appium path:
  path: '/wd/hub',
  capabilities: [
    {
      maxInstances: 1,
      browserName: 'chrome',
      platformName: 'Android',
      deviceName: 'Android Emulator',
      nativeWebScreenshot: true
    }
  ],
  videos: {
    enabled: true,
    bitRate: 100000,
    startDelay: 500,
    stopDelay: 1000
  },
  maximizeWindow: false
})
