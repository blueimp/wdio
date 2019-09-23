'use strict'

exports.config = Object.assign({}, require('./chrome').config, {
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
  // Disable maximizeWindow since it is broken for Edge webdriver
  maximizeWindow: false,
  // Disable file uploads as element.addValue() is broken for Edge webdriver:
  // > JSON format error: parameters object must contain pair with name "text"
  assetsDir: null
})
