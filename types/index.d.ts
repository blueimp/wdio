type mailhog = import('mailhog').API

declare namespace WebdriverIO {
  interface Config {
    maximizeWindow?: boolean
    assetsDir?: string
    mailhog?: import('mailhog').Options
    appium?: any
  }

  interface Browser {
    config: Config
    saveScreenshotByName: typeof import('wdio-screen-commands').saveScreenshotByName
    saveAndDiffScreenshot: typeof import('wdio-screen-commands').saveAndDiffScreenshot
  }

  interface Element {
    saveScreenshotByName: typeof import('wdio-screen-commands').saveScreenshotByName
    saveAndDiffScreenshot: typeof import('wdio-screen-commands').saveAndDiffScreenshot
  }
}
