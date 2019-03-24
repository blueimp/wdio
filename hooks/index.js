'use strict'

const cmds = require('wdio-screen-commands')

module.exports = {
  before: () => {
    require('chai').Should()
    global.uuidv4 = require('uuid/v4')
    const mailhog = require('mailhog')(browser.config.mailhog)
    browser.addCommand('mailhog', async (cmd, ...args) => {
      return mailhog[cmd].call(mailhog, args)
    })
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
