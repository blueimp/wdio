'use strict'

/* global browser, $ */
/* eslint-disable class-methods-use-this */

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
   *
   * @param {number} [timeout] Wait timeout
   */
  async open(timeout) {
    await browser.url('/')
    await this.recipient.waitForExist({ timeout })
  }
  /**
   * Sends mail.
   *
   * @param {string} recipient Mail recipient
   * @param {string} [subject] Mail subject
   * @param {string} [content] Mail text content
   * @param {Array<string>} [attachments] Mail attachments
   * @param {number} [timeout] Wait timeout
   */
  async send(recipient, subject, content, attachments, timeout) {
    await this.recipient.setValue(recipient)
    if (subject) await this.subject.setValue(subject)
    if (content) await this.content.setValue(content)
    if (attachments) await this.attachments.addValue(attachments.join('\n'))
    await this.submit.scrollIntoView()
    await this.submit.click()
    await this.result.waitForExist({ timeout })
  }
  /**
   * Returns to the mail form.
   *
   * @param {number} [timeout] Wait timeout
   */
  async return(timeout) {
    await this.back.click()
    await this.recipient.waitForExist({ timeout })
  }
  /**
   * Performs signout.
   *
   * @param {number} [timeout] Wait timeout
   */
  async logout(timeout) {
    await this.logoutButton.click()
    await this.password.waitForExist({ timeout })
  }
}

module.exports = new Mail()
