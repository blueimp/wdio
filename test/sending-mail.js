const id = uuidv4()
const recipient = id + '@example.org'

describe('Sending mail', () => {
  it('enforces required fields', () => {
    browser.url('/')
    $('#submit').click()
    $('#result').waitForExist(500, true)
    browser.getTitle().should.equal('Send mail')
  })

  it('sends mail', () => {
    browser.url('/')
    browser.getTitle().should.equal('Send mail')
    browser.saveAndDiffScreenshot('Send mail')
    $('#recipient').setValue(recipient)
    $('#subject').setValue('This is a test')
    $('#content').setValue(id)
    $('#submit').click()
    $('#result')
      .getText()
      .should.equal('Mail sent!')
    browser.getTitle().should.equal('Mail sent!')
    browser.saveAndDiffScreenshot('Mail sent')
    $('#back')
      .$('a')
      .click()
    browser.getTitle().should.equal('Send mail')
    browser.mailhog('latestTo', recipient).text.should.equal(id)
  })
})
