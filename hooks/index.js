'use strict'

/* global browser */

const cmds = require('wdio-screen-commands')
const { v4: uuidv4 } = require('uuid');

module.exports = {
  before: () => {
    global.should = require('chai').should()
    global.uuidv4 = uuidv4
    const mailhog = require('mailhog')(browser.config.mailhog)
    browser.addCommand('mailhog', (cmd, ...args) => mailhog[cmd](...args))
    browser.addCommand('saveScreenshotByName', cmds.saveScreenshotByName)
    browser.addCommand('saveAndDiffScreenshot', cmds.saveAndDiffScreenshot)
    if (browser.config.appium) browser.updateSettings(browser.config.appium)
    if (browser.config.maximizeWindow) browser.maximizeWindow()
  },
  beforeTest: test => {
    cmds.startScreenRecording(test)
  },
  afterTest: async test => {
    await cmds.stopScreenRecording(test)
    cmds.saveScreenshotByTest(test)
  }
}
