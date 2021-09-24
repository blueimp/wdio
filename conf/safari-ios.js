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
      //'safari:useSimulator': true,
      //'appium:automationName': 'safari',
      // Safaridriver seems to not trigger click events in Safari on iOS 15,
      // So we continue using XCUITest as automation driver for Webdriver tests.
      'appium:automationName': 'XCUITest',
      'appium:platformVersion': process.env.PLATFORM_VERSION || '15.0',
      'appium:deviceName': process.env.DEVICE_NAME || 'iPhone 13',
      'appium:orientation': orientation
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
