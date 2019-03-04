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
    enabled: false
  }
})
