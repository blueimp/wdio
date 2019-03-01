# WDIO
Docker setup for [WebdriverIO](https://webdriver.io/) with automatic
screenshots, image diffing and screen recording support for containerized
versions of Chrome and Firefox.

Also includes MacOS host configs to test an app running in Docker with Safari
Desktop as well as Safari Mobile and Chrome Mobile via
[Appium](http://appium.io/).

* [Usage](#usage)
  - [Chrome](#chrome)
  - [Firefox](#firefox)
  - [Safari](#safari)
  - [Mobile Safari](#mobile-safari)
  - [Mobile Chrome](#mobile-chrome)
  - [Cleanup](#cleanup)
* [License](#license)
* [Author](#author)

## Usage

### Chrome
Run the tests with Chrome:
```sh
docker-compose run --rm wdio [chrome]
```

Connect to Chrome via VNC:
```sh
open vnc://user:secret@localhost:5900
```

**Please Note:**  
To be able to see Chrome running via VNC or screen recordings, disable headless
mode in [chrome.js](chrome.js).

### Firefox
Run the tests with Firefox:
```sh
docker-compose run --rm wdio firefox
```

Connect to Firefox via VNC:
```sh
open vnc://user:secret@localhost:5901
```

### Safari
To run the tests with Safari on MacOS, follow these steps:

1. [Configure Safari to Enable WebDriver Support](https://developer.apple.com/documentation/webkit/testing_with_webdriver_in_safari#2957277).

2. Add the `example` host to your `/etc/hosts` file:
   ```sh
   printf '127.0.0.1\t%s\n' example | sudo tee -a /etc/hosts
   ```

3. Run `safaridriver` on port `4444`:
   ```sh
   safaridriver -p 4444
   ```

4. Run the tests with Safari:
   ```sh
   docker-compose run --rm wdio safari
   ```

### Mobile Safari
To run the tests with Mobile Safari on iOS Simulator, follow these steps:

1. Install [Xcode](https://itunes.apple.com/us/app/xcode/id497799835) from the
   Mac App Store.

2. Install the Xcode Command Line Tools:
   ```sh
   xcode-select --install
   ```

3. Install [Node.JS](https://nodejs.org/) and
   [Carthage](https://github.com/Carthage/Carthage) via
   [Homebrew](https://brew.sh/):
   ```sh
   brew install node carthage
   ```

4. Make sure the necessary [Appium](http://appium.io/) dependencies for iOS 
   testing are installed:
   ```sh
   npx appium-doctor --ios
   ```

5. Install [Appium Desktop](https://github.com/appium/appium-desktop).

6. Open Appium Desktop and click on "Start Server":
   ```sh
   open -a appium
   ```

7. Run the tests with Mobile Safari:
   ```sh
   docker-compose run --rm wdio mobile-safari
   ```

### Mobile Chrome
To run the tests with Mobile Chrome on Android Simulator, follow these steps:

1. Download [Android Studio](https://developer.android.com/studio/) and on first
   start, follow the instructions to install the Android SDK and Emulator.

2. Add the following lines to your `~/.profile` to make the JDK included in
   Android Studio and the installed Android SDK available to
   [Appium](http://appium.io/):
   ```sh
   export JAVA_HOME='/Applications/Android Studio.app/Contents/jre/jdk/Contents/Home'
   export PATH="$JAVA_HOME/bin:$PATH"
   export ANDROID_HOME=~/Library/Android/sdk
   ```

3. Install [Node.JS](https://nodejs.org/) via [Homebrew](https://brew.sh/):
   ```sh
   brew install node
   ```

4. Make sure the necessary [Appium](http://appium.io/) dependencies for Android 
   testing are installed:
   ```sh
   npx appium-doctor --android
   ```

5. Install [Appium Desktop](https://github.com/appium/appium-desktop).

6. Make sure to configure Appium with a
   [Chromedriver](https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/web/chromedriver.md)
   version compatible with the version of Chrome running in your Android device.

7. Open Appium Desktop and click on "Start Server":
   ```sh
   open -a appium
   ```

8. Start an Android Virtual Device via
   > Android Studio → Configure → AVD Manager

9. Run the tests with Mobile Chrome:
   ```sh
   docker-compose run --rm wdio mobile-chrome
   ```

### Cleanup
Stop and remove the docker-compose container set:
```sh
docker-compose down
```

## License
Released under the [MIT license](https://opensource.org/licenses/MIT).

## Author
[Sebastian Tschan](https://blueimp.net/)
