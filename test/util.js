'use strict'

const config = require('./config')

module.exports = {
  mailhog: require('mailhog')(config.mailhog)
}
