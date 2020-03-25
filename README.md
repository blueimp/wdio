# WDIO

Docker setup for [WebdriverIO](https://webdriver.io/) with automatic
screenshots, image diffing and screen recording support for containerized
versions of Chrome and Firefox, Safari Mobile and Chrome Mobile via
[Appium](https://appium.io/) and Safari on MacOS as well as Internet Explorer
and Microsoft Edge on Windows 10.

## Contents

- [Usage](#usage)
  - [Chrome](chrome.md)
  - [Firefox](firefox.md)
  - [Safari](safari.md)
  - [Mobile Safari](mobile-safari.md)
  - [Mobile Chrome](mobile-chrome.md)
  - [Internet Explorer](internet-explorer.md)
  - [Microsoft Edge Legacy](edge-legacy.md)
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
