describe('Form validation', () => {
  it('enforces required fields', () => {
    browser.url('/')
    $('#submit').click()
    $('#result').waitForExist(500, true)
    browser.getTitle().should.equal('Send mail')
  })
})
