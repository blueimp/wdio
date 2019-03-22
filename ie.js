exports.config = Object.assign({}, require('./chrome').config, {
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
    enabled: true,
    inputFormat: 'mjpeg',
    startDelay: 500,
    stopDelay: 1500
  }
})
