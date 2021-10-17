'use strict'

/* global describe, it, expect */

const uuidv4 = require('uuid').v4
const config = require('../config')
const {
  assets,
  browserAssets,
  validateAttachment,
  mailhog
} = require('../util')
const Login = require('../pages/login')
const Mail = require('../pages/mail')

describe('Attachments', () => {
  if (!browserAssets) return

  it('logs in', async () => {
    await Login.open()
    await Login.authenticate(config.user.email, config.user.password)
  })

  it('sends one', async () => {
    const recipient = uuidv4() + '@example.org'
    await Mail.open()
    await Mail.send(recipient, 'One attachment', null, [browserAssets[0]])
    const mail = await mailhog.latestTo(recipient)
    await expect(mail.attachments.length).toBe(1)
    const attachment = mail.attachments[0]
    validateAttachment(attachment, assets[0])
  })

  it('sends multiple', async () => {
    const recipient = uuidv4() + '@example.org'
    await Mail.open()
    await Mail.send(recipient, 'Multiple attachments', null, browserAssets)
    const mail = await mailhog.latestTo(recipient)
    await expect(mail.attachments.length).toBe(assets.length)
    const validations = []
    for (const [index, file] of assets.entries()) {
      const attachment = mail.attachments[index]
      validations.push(validateAttachment(attachment, file))
    }
    await Promise.all(validations)
  })
})
