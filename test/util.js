'use strict'

/* global browser, expect, BufferEncoding */

const fs = require('fs')
const path = require('path')
const mimeTypes = require('mime-types')
const config = require('./config')

const assets = fs
  .readdirSync(config.assetsDir, { withFileTypes: true })
  .filter(item => item.isFile() && item.name[0] !== '.')
  .map(item => path.join(config.assetsDir, item.name))

const browserAssets =
  browser.config.assetsDir &&
  assets.map(file => browser.config.assetsDir + path.basename(file))

/* eslint-disable jsdoc/valid-types */

/**
 * Validates a given attachment with the given file.
 *
 * @param {import('mailhog').Attachment} attachment Mail attachment
 * @param {string} file File path
 */
async function validateAttachment(attachment, file) {
  await expect(attachment.name).toBe(path.basename(file))
  await expect(attachment.type).toBe(mimeTypes.lookup(file))
  const body = Buffer.from(
    attachment.Body,
    /** @type {BufferEncoding} */
    (attachment.encoding)
  )
  await expect(body.equals(fs.readFileSync(file))).toBe(true)
}

/* eslint-enable jsdoc/valid-types */

module.exports = {
  assets,
  browserAssets,
  validateAttachment,
  mailhog: require('mailhog')(config.mailhog)
}
