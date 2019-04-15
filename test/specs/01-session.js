const config = require('../')
const Login = require('../pages/login')
const Mail = require('../pages/mail')

describe('Session', () => {
  it('requires login', () => {
    should.Throw(() => Mail.open(500))
    browser.getTitle().should.equal('Login')
  })

  it('requires email', () => {
    Login.open()
    should.Throw(() => Login.authenticate('', config.user.password, 500))
    browser.getTitle().should.equal('Login')
  })

  it('requires password', () => {
    Login.open()
    should.Throw(() => Login.authenticate(config.user.email, '', 500))
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
    should.Throw(() => Mail.open(500))
    browser.getTitle().should.equal('Login')
  })
})
