describe('Cookie counter', () => {
  it('counts page views', () => {
    browser.url('/cookie.html')
    for (let i = 1; i < 11; i++) {
      $('#counter=' + i).waitForExist()
      browser.refresh()
    }
  })
})
