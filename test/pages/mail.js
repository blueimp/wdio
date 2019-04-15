class Mail {
  get recipient() {
    return $('#recipient')
  }
  get subject() {
    return $('#subject')
  }
  get content() {
    return $('#content')
  }
  get attachments() {
    return $('#attachments')
  }
  get submit() {
    return $('#submit')
  }
  get result() {
    return $('#result')
  }
  get back() {
    return $('#back').$('a')
  }
  get logoutButton() {
    return $('#logout')
  }
  get password() {
    return $('#password')
  }
  /**
   * Opens the mail form.
   * @param {Number} [timeout] Wait timeout
   * @returns {Mail}
   */
  open(timeout) {
    browser.url('/')
    this.recipient.waitForExist(timeout)
    return this
  }
  /**
   * Sends mail.
   * @param {String} recipient Mail recipient
   * @param {String} [subject] Mail subject
   * @param {String} [content] Mail text content
   * @param {Array<String>} [attachments] Mail attachments
   * @param {Number} [timeout] Wait timeout
   * @returns {Mail}
   */
  send(recipient, subject, content, attachments, timeout) {
    this.recipient.setValue(recipient)
    if (subject) this.subject.setValue(subject)
    if (content) this.content.setValue(content)
    if (attachments) this.attachments.addValue(attachments.join('\n'))
    this.submit.click()
    this.result.waitForExist(timeout)
    return this
  }
  /**
   * Returns to the mail form.
   * @param {Number} [timeout] Wait timeout
   * @returns {Mail}
   */
  return(timeout) {
    this.back.click()
    this.recipient.waitForExist(timeout)
    return this
  }
  /**
   * Performs signout.
   * @param {Number} [timeout] Wait timeout
   * @returns {Mail}
   */
  logout(timeout) {
    this.logoutButton.click()
    this.password.waitForExist(timeout)
    return this
  }
}

module.exports = new Mail()
