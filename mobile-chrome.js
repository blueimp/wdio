exports.config = Object.assign({}, require('./wdio.conf').config, {
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
    enabled: false
  },
  maximizeWindow: false,
  baseUrl: 'http://10.0.2.2:8080'
})
