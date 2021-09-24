# WDIO

Docker setup for [WebdriverIO](https://webdriver.io/) with automatic
screenshots, image diffing and screen recording support for containerized
versions of Chrome and Firefox, Mobile Safari, Mobile Chrome and Mobile Firefox
via [Appium](https://appium.io/), Safari on MacOS as well as Edge and Internet
Explorer on Windows 10.

## Contents

- [Usage](#usage)
  - [Chrome](docs/chrome.md)
  - [Firefox](docs/firefox.md)
  - [Safari](docs/safari.md)
  - [Mobile Safari](docs/mobile-safari.md)
  - [Mobile Chrome](docs/mobile-chrome.md)
  - [Mobile Firefox](docs/mobile-firefox.md)
  - [Edge](docs/edge.md)
  - [Internet Explorer](docs/internet-explorer.md)
- [FAQ](docs/FAQ.md)
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
