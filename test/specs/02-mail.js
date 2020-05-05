'use strict'

/* global browser, describe, it, expect, uuidv4 */
/* eslint-disable new-cap */

const config = require('../')
const Login = require('../pages/login')
const Mail = require('../pages/mail')

describe('Mail', () => {
  it('logs in', () => {
    Login.open().authenticate(config.user.email, config.user.password)
  })

  it('requires recipient', () => {
    Mail.open()
    expect(() => Mail.send('', null, null, null, 500)).toThrow()
    expect(browser).toHaveTitle('Send mail')
  })

  it('sends unicode', () => {
    const recipient = uuidv4() + '@example.org'
    const content = '日本'
    Mail.open()
    expect(browser).toHaveTitle('Send mail')
    browser.saveAndDiffScreenshot('Send mail')
    Mail.send(recipient, 'Unicode mail', content)
    expect(Mail.result.getText()).toBe('Mail sent!')
    expect(browser).toHaveTitle('Mail sent!')
    browser.saveAndDiffScreenshot('Mail sent')
    Mail.return()
    expect(browser.latestMailTo(recipient).text).toBe(content)
  })
})
