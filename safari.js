exports.config = Object.assign({}, require('./wdio.conf').config, {
  // Docker for Mac host address:
  hostname: 'host.docker.internal',
  capabilities: [
    {
      maxInstances: 1,
      browserName: 'safari'
    }
  ],
  videos: {
    enabled: false
  },
  baseUrl: 'http://localhost:8080'
})
