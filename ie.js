exports.config = Object.assign({}, require('./wdio.conf').config, {
  // Windows VM:
  hostname: '10.211.55.3',
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
