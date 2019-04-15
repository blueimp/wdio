const config = require('../')
const Login = require('../pages/login')
const Mail = require('../pages/mail')
const assetsDir = browser.config.assetsDir

describe('Attachments', () => {
  if (!assetsDir) return

  it('logs in', () => {
    Login.open().authenticate(config.user.email, config.user.password)
  })

  it('sends one', () => {
    const recipient = uuidv4() + '@example.org'
    Mail.open().send(recipient, 'One attachment', null, [
      assetsDir + 'black-80x60.gif'
    ])
    const mail = browser.mailhog('latestTo', recipient)
    mail.attachments.length.should.equal(1)
    const attachment = mail.attachments[0]
    attachment.name.should.equal('black-80x60.gif')
    attachment.type.should.equal('image/gif')
    Buffer.from(attachment.Body, attachment.encoding)
      .toString('base64')
      .should.equal(
        'R0lGODdhUAA8AIABAAAAAP///ywAAAAAUAA8AAACS4SPqcvtD6OctNqLs968+w+G4kiW' +
          '5omm6sq27gvH8kzX9o3n+s73/g8MCofEovGITCqXzKbzCY1Kp9Sq9YrNarfcrvcLDo' +
          'vH5PKsAAA7'
      )
  })

  it('sends multiple', () => {
    const recipient = uuidv4() + '@example.org'
    Mail.open().send(recipient, 'Multiple attachments', null, [
      assetsDir + 'black-80x60.gif',
      assetsDir + 'white-1x2.jpg'
    ])
    const mail = browser.mailhog('latestTo', recipient)
    mail.attachments.length.should.equal(2)
    const attachment1 = mail.attachments[0]
    attachment1.name.should.equal('black-80x60.gif')
    attachment1.type.should.equal('image/gif')
    Buffer.from(attachment1.Body, attachment1.encoding)
      .toString('base64')
      .should.equal(
        'R0lGODdhUAA8AIABAAAAAP///ywAAAAAUAA8AAACS4SPqcvtD6OctNqLs968+w+G4kiW' +
          '5omm6sq27gvH8kzX9o3n+s73/g8MCofEovGITCqXzKbzCY1Kp9Sq9YrNarfcrvcLDo' +
          'vH5PKsAAA7'
      )
    const attachment2 = mail.attachments[1]
    attachment2.name.should.equal('white-1x2.jpg')
    attachment2.type.should.equal('image/jpeg')
    Buffer.from(attachment2.Body, attachment2.encoding)
      .toString('base64')
      .should.equal(
        '/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAASUkqAAgAAAABABIBAwABAAAABgAS' +
          'AAAAAAD/7QAsUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAA8cAgUACm9iamVjdG5hbW' +
          'UA/9sAQwABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB' +
          'AQEBAQEBAQEBAQEBAQEBAQEBAQEB/9sAQwEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ' +
          'EBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB/8AAEQgAAQAC' +
          'AwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAA' +
          'IBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNi' +
          'coIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dX' +
          'Z3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS' +
          '09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAA' +
          'ABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXET' +
          'IjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSl' +
          'NUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ip' +
          'qrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAA' +
          'wDAQACEQMRAD8A/v4ooooA/9k='
      )
  })
})
