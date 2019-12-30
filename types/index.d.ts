/**
 * Helper type to unwrap Promise return types
 */
type UnwrapReturnType<T> = T extends (...args: any[]) => Promise<infer U>
  ? U
  : T

type mailhog = import('mailhog').API

declare module WebdriverIO {
  interface Config {
    maximizeWindow?: boolean
    assetsDir?: string
    mailhog?: import('mailhog').Options
    appium?: any
  }

  interface Browser {
    getMail: (
      ...args: Parameters<mailhog['messages']>
    ) => UnwrapReturnType<mailhog['messages']>
    searchMail: (
      ...args: Parameters<mailhog['search']>
    ) => UnwrapReturnType<mailhog['search']>
    latestMailFrom: (
      ...args: Parameters<mailhog['latestFrom']>
    ) => UnwrapReturnType<mailhog['latestFrom']>
    latestMailTo: (
      ...args: Parameters<mailhog['latestTo']>
    ) => UnwrapReturnType<mailhog['latestTo']>
    latestMailContaining: (
      ...args: Parameters<mailhog['latestContaining']>
    ) => UnwrapReturnType<mailhog['latestContaining']>
    releaseMail: (
      ...args: Parameters<mailhog['releaseMessage']>
    ) => UnwrapReturnType<mailhog['releaseMessage']>
    deleteMail: (
      ...args: Parameters<mailhog['deleteMessage']>
    ) => UnwrapReturnType<mailhog['deleteMessage']>
    deleteAllMail: (
      ...args: Parameters<mailhog['deleteAll']>
    ) => UnwrapReturnType<mailhog['deleteAll']>
    encodeMail: mailhog['encode']
    decodeMail: mailhog['decode']
    saveScreenshotByName: typeof import('wdio-screen-commands').saveScreenshotByName
    saveAndDiffScreenshot: typeof import('wdio-screen-commands').saveAndDiffScreenshot
  }
}

declare module NodeJS {
  interface Global {
    Should: Chai.Should
    uuidv4: typeof import('uuid/v4')
  }
}

declare const Should: Chai.Should
declare const uuidv4: typeof import('uuid/v4')
