'use strict'

const orientation = process.env.ORIENTATION || 'PORTRAIT' // LANDSCAPE|PORTRAIT

/* eslint-disable jsdoc/valid-types */
/** @type WebdriverIO.Config */
const config = {
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
      platformVersion: process.env.PLATFORM_VERSION,
      deviceName: process.env.DEVICE_NAME || 'Android Emulator',
      nativeWebScreenshot: true,
      orientation
    }
  ],
  videos: {
    enabled: true,
    bitRate: 100000,
    startDelay: 500,
    stopDelay: 500
  },
  maximizeWindow: false,
  assetsDir: null
}

exports.config = Object.assign({}, require('./chrome').config, config)
