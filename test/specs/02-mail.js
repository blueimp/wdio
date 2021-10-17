'use strict'

/* global browser, describe, it, expect */
/* eslint-disable new-cap */

const uuidv4 = require('uuid').v4
const config = require('../config')
const { mailhog } = require('../util')
const Login = require('../pages/login')
const Mail = require('../pages/mail')

describe('Mail', () => {
  it('logs in', async () => {
    await Login.open()
    await Login.authenticate(config.user.email, config.user.password)
  })

  it('requires recipient', async () => {
    await Mail.open()
    await expect(Mail.send('', null, null, null, 500)).rejects.toThrow()
    await expect(browser).toHaveTitle('Send mail')
  })

  it('sends unicode', async () => {
    const recipient = uuidv4() + '@example.org'
    const content = '日本'
    await Mail.open()
    await expect(browser).toHaveTitle('Send mail')
    await browser.saveAndDiffScreenshot('Send mail')
    await Mail.send(recipient, 'Unicode mail', content)
    await expect(await Mail.result.getText()).toBe('Mail sent!')
    await expect(browser).toHaveTitle('Mail sent!')
    await browser.saveAndDiffScreenshot('Mail sent')
    await Mail.return()
    await expect((await mailhog.latestTo(recipient)).text).toBe(content)
  })
})
