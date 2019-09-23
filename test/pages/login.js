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
   * @returns {Login} Login object
   */
  open(timeout) {
    browser.url('/login.html')
    this.password.waitForExist(timeout)
    return this
  }
  /**
   * Authenticates user.
   *
   * @param {string} email User email
   * @param {string} password User password
   * @param {number} [timeout] Wait timeout
   * @returns {Login} Login object
   */
  authenticate(email, password, timeout) {
    this.email.setValue(email)
    this.password.setValue(password)
    this.submit.click()
    this.recipient.waitForExist(timeout)
    return this
  }
}

module.exports = new Login()
