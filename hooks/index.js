'use strict'

/* global browser */

const cmds = require('wdio-screen-commands')

/* eslint-disable jsdoc/valid-types */
/** @type WebdriverIO.Config */
const config = {
  before: async () => {
    global.Should = require('chai').should()
    global.uuidv4 = require('uuid/v4')
    const mailhog = require('mailhog')(browser.config.mailhog)
    browser.addCommand('getMail', mailhog.messages)
    browser.addCommand('searchMail', mailhog.search)
    browser.addCommand('latestMailFrom', mailhog.latestFrom)
    browser.addCommand('latestMailTo', mailhog.latestTo)
    browser.addCommand('latestMailContaining', mailhog.latestContaining)
    browser.addCommand('releaseMail', mailhog.releaseMessage)
    browser.addCommand('deleteMail', mailhog.deleteMessage)
    browser.addCommand('deleteAllMail', mailhog.deleteAll)
    browser.addCommand('encodeMail', mailhog.encode)
    browser.addCommand('decodeMail', mailhog.decode)
    browser.addCommand('saveScreenshotByName', cmds.saveScreenshotByName)
    browser.addCommand('saveAndDiffScreenshot', cmds.saveAndDiffScreenshot)
    if (browser.config.appium)
      await browser.updateSettings(browser.config.appium)
    if (browser.config.maximizeWindow) await browser.maximizeWindow()
  },
  beforeTest: async test => {
    await cmds.startScreenRecording(test)
  },
  afterTest: async test => {
    await Promise.all([
      cmds.stopScreenRecording(test),
      cmds.saveScreenshotByTest(test)
    ])
  }
}

module.exports = config
