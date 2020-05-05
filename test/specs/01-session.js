'use strict'

/* global browser, describe, it, expect */
/* eslint-disable new-cap */

const config = require('../')
const Login = require('../pages/login')
const Mail = require('../pages/mail')

describe('Session', () => {
  it('requires login', () => {
    expect(() => Mail.open(500)).toThrow()
    expect(browser).toHaveTitle('Login')
  })

  it('requires email', () => {
    Login.open()
    expect(() => Login.authenticate('', config.user.password, 500)).toThrow()
    expect(browser).toHaveTitle('Login')
  })

  it('requires password', () => {
    Login.open()
    expect(() => Login.authenticate(config.user.email, '', 500)).toThrow()
    expect(browser).toHaveTitle('Login')
  })

  it('logs in', () => {
    Login.open()
    expect(browser).toHaveTitle('Login')
    browser.saveAndDiffScreenshot('Login')
    Login.authenticate(config.user.email, config.user.password)
    expect(browser).toHaveTitle('Send mail')
  })

  it('logs out', () => {
    Mail.open().logout()
    expect(() => Mail.open(500)).toThrow()
    expect(browser).toHaveTitle('Login')
  })
})
