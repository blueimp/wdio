'use strict'

/* global browser, describe, it, uuidv4, BufferEncoding */

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

  it('logs in', () => {
    Login.open().authenticate(config.user.email, config.user.password)
  })

  it('sends one', () => {
    const recipient = uuidv4() + '@example.org'
    Mail.open().send(recipient, 'One attachment', null, [
      assetsDir + 'black+white-60x40.gif'
    ])
    const mail = browser.latestMailTo(recipient)
    mail.attachments.length.should.equal(1)
    const attachment = mail.attachments[0]
    attachment.name.should.equal('black+white-60x40.gif')
    attachment.type.should.equal('image/gif')
    Buffer.from(
      attachment.Body,
      /** @type {BufferEncoding} */
      (attachment.encoding)
    )
      .toString('base64')
      .should.equal(b64DataGIF)
  })

  it('sends multiple', () => {
    const recipient = uuidv4() + '@example.org'
    Mail.open().send(recipient, 'Multiple attachments', null, [
      assetsDir + 'black+white-60x40.gif',
      assetsDir + 'black+white-3x2.jpg'
    ])
    const mail = browser.latestMailTo(recipient)
    mail.attachments.length.should.equal(2)
    const attachment1 = mail.attachments[0]
    attachment1.name.should.equal('black+white-60x40.gif')
    attachment1.type.should.equal('image/gif')
    Buffer.from(
      attachment1.Body,
      /** @type {BufferEncoding} */
      (attachment1.encoding)
    )
      .toString('base64')
      .should.equal(b64DataGIF)
    const attachment2 = mail.attachments[1]
    attachment2.name.should.equal('black+white-3x2.jpg')
    attachment2.type.should.equal('image/jpeg')
    Buffer.from(
      attachment2.Body,
      /** @type {BufferEncoding} */
      (attachment2.encoding)
    )
      .toString('base64')
      .should.equal(b64DataJPEG)
  })
})
