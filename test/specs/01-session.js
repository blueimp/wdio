'use strict'

/* global browser, describe, it, expect */
/* eslint-disable new-cap */

const config = require('../')
const Login = require('../pages/login')
const Mail = require('../pages/mail')

describe('Session', () => {
  it('requires login', async () => {
    await expect(Mail.open(500)).rejects.toThrow()
    await expect(browser).toHaveTitle('Login')
  })

  it('requires email', async () => {
    await Login.open()
    await expect(
      Login.authenticate('', config.user.password, 500)
    ).rejects.toThrow()
    await expect(browser).toHaveTitle('Login')
  })

  it('requires password', async () => {
    await Login.open()
    await expect(
      Login.authenticate(config.user.email, '', 500)
    ).rejects.toThrow()
    await expect(browser).toHaveTitle('Login')
  })

  it('logs in', async () => {
    await Login.open()
    await expect(browser).toHaveTitle('Login')
    await browser.saveAndDiffScreenshot('Login')
    await Login.authenticate(config.user.email, config.user.password)
    await expect(browser).toHaveTitle('Send mail')
  })

  it('logs out', async () => {
    await Mail.open()
    await Mail.logout()
    await expect(Mail.open(500)).rejects.toThrow()
    await expect(browser).toHaveTitle('Login')
  })
})
