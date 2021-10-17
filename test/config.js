'use strict'

const env = process.env

module.exports = {
  mailhog: {
    host: env.MAILHOG_HOST || 'localhost'
  },
  assetsDir: env.ASSETS_DIR || 'assets',
  user: {
    email: env.USER_MAIL || 'user@example',
    password: env.USER_PASS || 'password'
  }
}
