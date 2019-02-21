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
      browserName: 'safari',
      platformName: 'iOS',
      platformVersion: '12.1',
      deviceName: 'iPhone SE'
    }
  ],
  videos: {
    enabled: false
  },
  maximizeWindow: false,
  baseUrl: 'http://localhost:8080'
})
