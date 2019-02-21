describe('Form validation', () => {
  it('should be enforced', () => {
    browser.url('/')
    $('#submit').click()
    $('#result').waitForExist(500, true)
    browser.getTitle().should.equal('Send mail')
  })
})
