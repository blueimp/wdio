'use strict'

/* global browser, describe, it, should, uuidv4 */
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
    should.Throw(() => Mail.send('', null, null, null, 500))
    browser.getTitle().should.equal('Send mail')
  })

  it('sends unicode', () => {
    const recipient = uuidv4() + '@example.org'
    const content = '日本'
    Mail.open()
    browser.getTitle().should.equal('Send mail')
    browser.saveAndDiffScreenshot('Send mail')
    Mail.send(recipient, 'Unicode mail', content)
    Mail.result.getText().should.equal('Mail sent!')
    browser.getTitle().should.equal('Mail sent!')
    browser.saveAndDiffScreenshot('Mail sent')
    Mail.return()
    browser.mailhog('latestTo', recipient).text.should.equal(content)
  })
})
