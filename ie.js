exports.config = Object.assign({}, require('./wdio.conf').config, {
  hostname: process.env.WINDOWS_HOST || 'host.docker.internal',
  port: 4445,
  capabilities: [
    {
      // IEDriverServer supports no parallel sessions:
      maxInstances: 1,
      browserName: 'internet explorer'
    }
  ],
  videos: {
    enabled: false
  }
})
