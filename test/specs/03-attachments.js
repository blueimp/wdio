'use strict'

/* global browser, describe, it, expect, uuidv4, BufferEncoding */

const config = require('../')
const Login = require('../pages/login')
const Mail = require('../pages/mail')
const assetsDir = browser.config.assetsDir

const b64DataGIF =
  'R0lGODlhPAAoAPECAAAAAP///wAAAAAAACH5BAUAAAIALAAAAAA8ACgAQAJihI+Zwe0Po3Sq1o' +
  'kztvzoDwbdSJbmiaaqGbbTCrjyA9f2jef6Ts6+uPrNYEIZsdg6IkG8pvMJjUqnVOgypLxmstpX' +
  'sLv9gr2q8UZshnDTjTUbWH7TqvS6/Y7P6/f8vv9vVwAAOw=='

const b64DataJPEG =
  '/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/7QA0UGhvdG9zaG9wIDMuMA' +
  'A4QklNBAQAAAAAABccAgUAC2JsdWVpbXAubmV0HAIAAAIABAD/2wCEAAEBAQEBAQEBAQEBAQEB' +
  'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ' +
  'EBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB' +
  'AQEBAf/AABEIAAIAAwMBEQACEQEDEQH/xABRAAEAAAAAAAAAAAAAAAAAAAAKEAEBAQADAQEAAA' +
  'AAAAAAAAAGBQQDCAkCBwEBAAAAAAAAAAAAAAAAAAAAABEBAAAAAAAAAAAAAAAAAAAAAP/aAAwD' +
  'AQACEQMRAD8AG8T9NfSMEVMhQvoP3fFiRZ+MTHDifa/95OFSZU5OzRzxkyejv8ciEfhSceSXGj' +
  'S8eSdLnZc2HDm4M3BxcXwH/9k='

describe('Attachments', () => {
  if (!assetsDir) return

  it('logs in', async () => {
    await Login.open()
    await Login.authenticate(config.user.email, config.user.password)
  })

  it('sends one', async () => {
    const recipient = uuidv4() + '@example.org'
    await Mail.open()
    await Mail.send(recipient, 'One attachment', null, [
      assetsDir + 'black+white-60x40.gif'
    ])
    const mail = await browser.latestMailTo(recipient)
    await expect(mail.attachments.length).toBe(1)
    const attachment = mail.attachments[0]
    await expect(attachment.name).toBe('black+white-60x40.gif')
    await expect(attachment.type).toBe('image/gif')
    await expect(
      Buffer.from(
        attachment.Body,
        /** @type {BufferEncoding} */
        (attachment.encoding)
      ).toString('base64')
    ).toBe(b64DataGIF)
  })

  it('sends multiple', async () => {
    const recipient = uuidv4() + '@example.org'
    await Mail.open()
    await Mail.send(recipient, 'Multiple attachments', null, [
      assetsDir + 'black+white-60x40.gif',
      assetsDir + 'black+white-3x2.jpg'
    ])
    const mail = await browser.latestMailTo(recipient)
    await expect(mail.attachments.length).toBe(2)
    const attachment1 = mail.attachments[0]
    await expect(attachment1.name).toBe('black+white-60x40.gif')
    await expect(attachment1.type).toBe('image/gif')
    await expect(
      Buffer.from(
        attachment1.Body,
        /** @type {BufferEncoding} */
        (attachment1.encoding)
      ).toString('base64')
    ).toBe(b64DataGIF)
    const attachment2 = mail.attachments[1]
    await expect(attachment2.name).toBe('black+white-3x2.jpg')
    await expect(attachment2.type).toBe('image/jpeg')
    await expect(
      Buffer.from(
        attachment2.Body,
        /** @type {BufferEncoding} */
        (attachment2.encoding)
      ).toString('base64')
    ).toBe(b64DataJPEG)
  })
})
