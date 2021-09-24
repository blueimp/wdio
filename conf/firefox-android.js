'use strict'

/* eslint-disable jsdoc/valid-types */
/** @type WebdriverIO.Config */
const config = {
  // Docker for Mac host address:
  hostname: 'host.docker.internal',
  capabilities: [
    {
      maxInstances: 1,
      browserName: 'firefox',
      'moz:firefoxOptions': {
        // Set if multiple Android devices are present:
        // androidDeviceSerial: 'emulator-5554',
        // @ts-ignore
        androidPackage: 'org.mozilla.firefox'
      }
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
