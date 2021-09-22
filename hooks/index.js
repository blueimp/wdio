'use strict'

/* global browser */

const cmds = require('wdio-screen-commands')

/* eslint-disable jsdoc/valid-types */
/** @type WebdriverIO.HookFunctionExtension */
const config = {
  before: async () => {
    const mailhog = require('mailhog')(browser.config.mailhog)
    // Add browser commands:
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
    // Add element commands:
    browser.addCommand('saveScreenshotByName', cmds.saveScreenshotByName, true)
    browser.addCommand(
      'saveAndDiffScreenshot',
      cmds.saveAndDiffScreenshot,
      true
    )
    if (browser.config.appium)
      await browser.updateSettings(browser.config.appium)
    if (browser.config.maximizeWindow) await browser.maximizeWindow()
  },
  beforeTest: async test => {
    await cmds.startScreenRecording(test)
  },
  afterTest: async (test, context, result) => {
    await Promise.all([
      cmds.stopScreenRecording(test, result),
      cmds.saveScreenshotByTest(test, result)
    ])
  }
}

module.exports = config
