'use strict'

/* eslint-disable jsdoc/valid-types */
/** @type WebdriverIO.Config */
const config = {
  hostname: process.env.WINDOWS_HOST || 'host.docker.internal',
  capabilities: [
    {
      // MicrosoftWebDriver supports no parallel sessions:
      maxInstances: 1,
      browserName: 'MicrosoftEdge'
    }
  ],
  videos: {
    enabled: true,
    inputFormat: 'mjpeg',
    startDelay: 500,
    stopDelay: 500
  },
  // Disable maximizeWindow since it is broken for Edge Legacy webdriver:
  maximizeWindow: false,
  // Disable file uploads as Edge Legacy webdriver does not support it:
  assetsDir: null
}

exports.config = Object.assign({}, require('./chrome').config, config)
