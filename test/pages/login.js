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
   * @param {Number} [timeout] Wait timeout
   * @returns {Login}
   */
  open(timeout) {
    browser.url('/login.html')
    this.password.waitForExist(timeout)
    return this
  }
  /**
   * Authenticates user.
   * @param {String} email User email
   * @param {String} password User password
   * @param {Number} [timeout] Wait timeout
   * @returns {Login}
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
