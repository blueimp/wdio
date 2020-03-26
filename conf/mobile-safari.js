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
      browserName: 'safari',
      platformName: 'iOS',
      platformVersion: process.env.PLATFORM_VERSION || '13.3',
      deviceName: process.env.DEVICE_NAME || 'iPhone 11',
      orientation
    }
  ],
  appium: {
    mjpegServerFramerate: 15,
    mjpegServerScreenshotQuality: 100
  },
  videos: {
    enabled: true,
    inputFormat: 'mjpeg',
    rotate: orientation === 'LANDSCAPE' ? 90 : undefined,
    port: 9100,
    startDelay: 500,
    stopDelay: 500
  },
  maximizeWindow: false,
  assetsDir: null
}

exports.config = Object.assign({}, require('./chrome').config, config)
