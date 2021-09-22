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

    getMail: mailhog['messages']
    searchMail: mailhog['search']
    latestMailFrom: mailhog['latestFrom']
    latestMailTo: mailhog['latestTo']
    latestMailContaining: mailhog['latestContaining']
    releaseMail: mailhog['releaseMessage']
    deleteMail: mailhog['deleteMessage']
    deleteAllMail: mailhog['deleteAll']
    encodeMail: mailhog['encode']
    decodeMail: mailhog['decode']
    saveScreenshotByName: typeof import('wdio-screen-commands').saveScreenshotByName
    saveAndDiffScreenshot: typeof import('wdio-screen-commands').saveAndDiffScreenshot
  }

  interface Element {
    saveScreenshotByName: typeof import('wdio-screen-commands').saveScreenshotByName
    saveAndDiffScreenshot: typeof import('wdio-screen-commands').saveAndDiffScreenshot
  }
}

declare var uuidv4: typeof import('uuid').v4
