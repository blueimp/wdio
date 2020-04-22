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
   * @returns {Mail} Mail object
   */
  open(timeout) {
    browser.url('/')
    this.recipient.waitForExist(timeout)
    return this
  }
  /**
   * Sends mail.
   *
   * @param {string} recipient Mail recipient
   * @param {string} [subject] Mail subject
   * @param {string} [content] Mail text content
   * @param {Array<string>} [attachments] Mail attachments
   * @param {number} [timeout] Wait timeout
   * @returns {Mail} Mail object
   */
  send(recipient, subject, content, attachments, timeout) {
    this.recipient.setValue(recipient)
    if (subject) this.subject.setValue(subject)
    if (content) this.content.setValue(content)
    if (attachments) this.attachments.addValue(attachments.join('\n'))
    this.submit.scrollIntoView()
    this.submit.click()
    this.result.waitForExist(timeout)
    return this
  }
  /**
   * Returns to the mail form.
   *
   * @param {number} [timeout] Wait timeout
   * @returns {Mail} Mail object
   */
  return(timeout) {
    this.back.click()
    this.recipient.waitForExist(timeout)
    return this
  }
  /**
   * Performs signout.
   *
   * @param {number} [timeout] Wait timeout
   * @returns {Mail} Mail object
   */
  logout(timeout) {
    this.logoutButton.click()
    this.password.waitForExist(timeout)
    return this
  }
}

module.exports = new Mail()
