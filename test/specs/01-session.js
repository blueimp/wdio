'use strict'

/* global browser, describe, it, Should */
/* eslint-disable new-cap */

const config = require('../')
const Login = require('../pages/login')
const Mail = require('../pages/mail')

describe('Session', () => {
  it('requires login', () => {
    Should.Throw(() => Mail.open(500))
    browser.getTitle().should.equal('Login')
  })

  it('requires email', () => {
    Login.open()
    Should.Throw(() => Login.authenticate('', config.user.password, 500))
    browser.getTitle().should.equal('Login')
  })

  it('requires password', () => {
    Login.open()
    Should.Throw(() => Login.authenticate(config.user.email, '', 500))
    browser.getTitle().should.equal('Login')
  })

  it('logs in', () => {
    Login.open()
    browser.getTitle().should.equal('Login')
    browser.saveAndDiffScreenshot('Login')
    Login.authenticate(config.user.email, config.user.password)
    browser.getTitle().should.equal('Send mail')
  })

  it('logs out', () => {
    Mail.open().logout()
    Should.Throw(() => Mail.open(500))
    browser.getTitle().should.equal('Login')
  })
})
