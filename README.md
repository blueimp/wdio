# WDIO

Docker setup for [WebdriverIO](https://webdriver.io/) with automatic
screenshots, image diffing and screen recording support for containerized
versions of Chrome and Firefox, Mobile Safari and Mobile Chrome via
[Appium](https://appium.io/), Safari on MacOS as well as Edge, Edge Legacy and
Internet Explorer on Windows 10.

## Contents

- [Usage](#usage)
  - [Chrome](chrome.md)
  - [Firefox](firefox.md)
  - [Safari](safari.md)
  - [Mobile Safari](mobile-safari.md)
  - [Mobile Chrome](mobile-chrome.md)
  - [Edge](edge.md)
  - [Edge Legacy](edge-legacy.md)
  - [Internet Explorer](internet-explorer.md)
- [FAQ](FAQ.md)
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
