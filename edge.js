exports.config = Object.assign({}, require('./wdio.conf').config, {
  // Windows VM:
  hostname: '10.211.55.3',
  capabilities: [
    {
      // MicrosoftWebDriver supports no parallel sessions:
      maxInstances: 1,
      browserName: 'MicrosoftEdge'
    }
  ],
  videos: {
    enabled: false
  }
})
