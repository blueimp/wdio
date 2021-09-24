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

## License

Released under the [MIT license](https://opensource.org/licenses/MIT).

## Author

[Sebastian Tschan](https://blueimp.net/)
