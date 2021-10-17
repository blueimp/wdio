# WDIO

Docker setup for [WebdriverIO](https://webdriver.io/) with automatic
screenshots, image diffing and screen recording support for containerized
versions of Chrome and Firefox on Linux, mobile versions of Chrome and Firefox
on Android as well as Safari on iOS, Safari on macOS and Edge on Windows.

## Contents

- [Usage](#usage)
  - [Chrome](docs/chrome.md)
  - [Firefox](docs/firefox.md)
  - [Safari](docs/safari.md)
  - [Safari on iOS](docs/safari-ios.md)
  - [Chrome on Android](docs/chrome-android.md)
  - [Firefox on Android](docs/firefox-android.md)
  - [Edge](docs/edge.md)
- [Tags](#tags)
- [Playwright](#playwright)
- [License](#license)
- [Author](#author)

## Usage

Run the tests:

```sh
docker-compose run --rm wdio [wdio.conf.js]
```

Stop and remove the container set:

```sh
docker-compose down
```

## Tags

For any critical infrastructure (e.g. your company's Continuous Integration
tests) it is **strongly** recommended to use your own tagged Docker images
instead of `blueimp/wdio` and the other provided sample Docker images directly,
as changes in the included software might break your tests inadvertently. See
also:

- [blueimp/chromedriver#tags](https://github.com/blueimp/chromedriver#tags)
- [blueimp/geckodriver#tags](https://github.com/blueimp/geckodriver#tags)

## Playwright

An alternative example end-to-end testing setup using the
[Playwright](https://playwright.dev/) framework can be found at
[blueimp/playwright-example](https://github.com/blueimp/playwright-example).

## License

Released under the [MIT license](https://opensource.org/licenses/MIT).

## Author

[Sebastian Tschan](https://blueimp.net/)
