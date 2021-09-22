'use strict'

/* global browser, $ */
/* eslint-disable class-methods-use-this */

class Login {
  get email() {
    return $('#email')
  }
  get password() {
    return $('#password')
  }
  get submit() {
    return $('#submit')
  }
  get recipient() {
    return $('#recipient')
  }
  /**
   * Opens the login form.
   *
   * @param {number} [timeout] Wait timeout
   */
  async open(timeout) {
    await browser.url('/login.html')
    await this.password.waitForExist({ timeout })
  }
  /**
   * Authenticates user.
   *
   * @param {string} email User email
   * @param {string} password User password
   * @param {number} [timeout] Wait timeout
   */
  async authenticate(email, password, timeout) {
    await this.email.setValue(email)
    await this.password.setValue(password)
    await this.submit.click()
    await this.recipient.waitForExist({ timeout })
  }
}

module.exports = new Login()
