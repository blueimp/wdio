# WDIO

Docker setup for [WebdriverIO](https://webdriver.io/) with automatic
screenshots, image diffing and screen recording support for containerized
versions of Chrome and Firefox, Safari Mobile and Chrome Mobile via
[Appium](https://appium.io/) and Safari on MacOS as well as Internet Explorer
and Microsoft Edge on Windows 10.

## Contents

- [Usage](#usage)
  - [Chrome](#chrome)
  - [Firefox](#firefox)
  - [Safari](#safari)
  - [Mobile Safari](#mobile-safari)
  - [Mobile Chrome](#mobile-chrome)
  - [Internet Explorer](#internet-explorer)
  - [Microsoft Edge](#microsoft-edge)
  - [Shutdown](#shutdown)
- [License](#license)
- [Author](#author)

## Usage

### Chrome

Run the tests with Chrome:

```sh
docker-compose run --rm wdio [chrome.js]
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
docker-compose run --rm wdio firefox.js
```

Connect to Firefox via VNC:

```sh
open vnc://user:secret@localhost:5901
```

### Safari

To run the tests with Safari on MacOS, follow these steps:

1. Configure Safari to Enable WebDriver Support (see
   [Testing with WebDriver in Safari](https://developer.apple.com/documentation/webkit/testing_with_webdriver_in_safari)):

   ```
   safaridriver --enable
   ```

   For
   [Safari Technology Preview](https://developer.apple.com/safari/technology-preview/):

   ```
   /Applications/Safari Technology Preview.app/Contents/MacOS/safaridriver --enable
   ```

2. Download and install [MJPEG Server](https://github.com/blueimp/mjpeg-server)
   as `mjpeg-server` in your `PATH` and install [FFmpeg](https://ffmpeg.org/)
   via [Homebrew](https://brew.sh/):

   ```sh
   brew install ffmpeg
   ```

3. Add the `example` host to your `/etc/hosts` file:

   ```sh
   printf '127.0.0.1\t%s\n' example | sudo tee -a /etc/hosts
   ```

4. Start `safaridriver` and `mjpeg-server` with the provided helper script:

   ```sh
   bin/safaridriver.sh [-t] [screen index]
   ```

   Providing the `-t` argument starts the `safaridriver` for
   [Safari Technology Preview](https://developer.apple.com/safari/technology-preview/).

   Providing a number as screen index (e.g. `2`) allows to use a different
   capture screen. Running the command without this argument will display a list
   of available screens if there are more than one available.

   **Please Note:**  
   The Terminal application the `mjpeg-server` command is started from requires
   Screen Recording permissions:  
   System Preferences => Security & Privacy => Privacy => Screen Recording

5. Run the tests with Safari:
   ```sh
   docker-compose run --rm wdio safari.js
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

4. Make sure the necessary [Appium](https://appium.io/) dependencies for iOS
   testing are installed:

   ```sh
   npx appium-doctor --ios
   ```

5. Install [Appium](https://appium.io/) as global NPM package:

   ```sh
   npm install -g appium
   ```

6. Add the `example` host to your `/etc/hosts` file:

   ```sh
   printf '127.0.0.1\t%s\n' example | sudo tee -a /etc/hosts
   ```

7. Start `appium` with the provided helper script:

   ```sh
   bin/appium.sh
   ```

8. Run the tests with Mobile Safari:

   ```sh
   docker-compose run --rm wdio mobile-safari.js
   ```

   To run the tests in landscape orientation, provide the `ORIENTATION`
   environment variable:

   ```sh
   ORIENTATION=LANDSCAPE docker-compose run --rm wdio mobile-safari.js
   ```

   To use a different iOS device than defined in the config, provide the
   `DEVICE_NAME` environment variable:

   ```sh
   DEVICE_NAME='iPad Pro (11-inch)' \
    docker-compose run --rm wdio mobile-safari.js
   ```

   To use a different iOS version than defined in the config, provide the
   `PLATFORM_VERSION` environment variable:

   ```sh
   PLATFORM_VERSION=12.1 docker-compose run --rm wdio mobile-safari.js
   ```

### Mobile Chrome

To run the tests with Mobile Chrome on Android Simulator, follow these steps:

1. Download [Android Studio](https://developer.android.com/studio/) and on first
   start, follow the instructions to install the Android SDK and Emulator.

2. Add the following lines to your `~/.profile` to make the JDK included in
   Android Studio and the installed Android SDK available to
   [Appium](https://appium.io/):

   ```sh
   export JAVA_HOME='/Applications/Android Studio.app/Contents/jre/jdk/Contents/Home'
   export PATH="$JAVA_HOME/bin:$PATH"
   export ANDROID_HOME=~/Library/Android/sdk
   ```

3. Install [Node.JS](https://nodejs.org/) via [Homebrew](https://brew.sh/):

   ```sh
   brew install node
   ```

4. Make sure the necessary [Appium](https://appium.io/) dependencies for Android
   testing are installed:

   ```sh
   npx appium-doctor --android
   ```

5. Install [Appium](https://appium.io/) as global NPM package:

   ```sh
   npm install -g appium [--chromedriver_version=VERSION]
   ```

   Make sure to configure `appium` with a
   [Chromedriver](https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/web/chromedriver.md)
   version compatible with the version of Chrome running in your Android device.
   If `appium` has already been installed with an incompatible `chromedriver`
   version, you might want to uninstall and reinstall it with the proper
   `--chromedriver_version` argument.

6. Start `appium` with the provided helper script:

   ```sh
   bin/appium.sh
   ```

7. Start the Android Virtual Device with a custom `/etc/hosts` file:

   ```sh
   bin/android-emulator.sh -hosts etc/android.hosts
   ```

8. Run the tests with Mobile Chrome:

   ```sh
   docker-compose run --rm wdio mobile-chrome.js
   ```

   To run the tests in landscape orientation, provide the `ORIENTATION`
   environment variable:

   ```sh
   ORIENTATION=LANDSCAPE docker-compose run --rm wdio mobile-chrome.js
   ```

### Internet Explorer

**Please Note:**  
This guide assumes that a system with Windows 10 has been set up, e.g. using the
"MSEdge on Win10" virtual machine image (which also includes Internet Explorer)
from
[Microsoft's Free VMs](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/)
site.

To run the tests with Internet Explorer, follow these steps:

1. Set "Change the size of text, apps, and other items" to 100% in Windows
   Display Settings.  
   If the option is grayed out, make sure the graphics configuration allows
   changing the scaling setting (see e.g.
   [Parallels article #123951](https://kb.parallels.com/en/123951)).

2. Make sure the Internet Explorer `Zoom` level is set to `100%` so that the
   native mouse events can be set to the correct coordinates.

3. Create a `.env` file in the same directory as
   [docker-compose.yml](docker-compose.yml) and add the following environment
   variables:

   ```sh
   SERVER_HOST=<DOCKER_HOST_IP>
   SERVER_PORT=8080
   WINDOWS_HOST=<WINDOWS_HOST_IP>
   WINDOWS_ASSETS_DIR=C:\Users\<USERNAME>\Desktop\assets\
   ```

   Make sure that the `DOCKER_HOST_IP` is accessible from the Windows machine
   and the `WINDOWS_HOST_IP` is accessible from a Docker container (see also the
   [FAQ](FAQ.md)).  
   Also make sure that `WINDOWS_ASSETS_DIR` points to a valid folder path and
   ends with a backslash.

4. Edit the `example` host entry in [etc/windows.hosts](etc/windows.hosts) and
   set its IP address to the `SERVER_HOST` IP defined in the `.env` file.

5. Copy [bin/webdriver.ps1](bin/webdriver.ps1) and
   [etc/windows.hosts](etc/windows.hosts) to the same folder in the Windows
   machine (e.g. the Desktop).  
   Also copy the files in the `assets` directory to the folder defined as
   `WINDOWS_ASSETS_DIR`.

6. Create a shortcut to `webdriver.ps1` (via "Right-Click" → "Create shortcut"),
   then open the properties dialog for the shortcut (via "Right-Click" →
   "Properties") and set the `Target` property to the following value:

   ```bat
   powershell -ExecutionPolicy ByPass -File webdriver.ps1
   ```

   Click "OK" to save the changes to the shortcut.

7. Double-Click on the webdriver shortcut to setup and start the servers.  
   Allow `nginx` and `MJPEGServer` to communicate on all networks in the Windows
   Defender Firewall dialog.

8. Run the tests with Internet Explorer:
   ```sh
   docker-compose run --rm wdio ie.js
   ```

### Microsoft Edge

**Please Note:**  
This guide assumes that a system with Windows 10 has been set up.  
The scripted installation of
[MicrosoftWebDriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/)
also requires `17763` as minimum Windows build version.

To run the tests with Microsoft Edge, follow these steps:

1. Create a `.env` file in the same directory as
   [docker-compose.yml](docker-compose.yml) and add the following environment
   variables:

   ```sh
   SERVER_HOST=<DOCKER_HOST_IP>
   SERVER_PORT=8080
   WINDOWS_HOST=<WINDOWS_HOST_IP>
   WINDOWS_ASSETS_DIR=C:\Users\<USERNAME>\Desktop\assets\
   ```

   Make sure that the `DOCKER_HOST_IP` is accessible from the Windows machine
   and the `WINDOWS_HOST_IP` is accessible from a Docker container (see also the
   [FAQ](FAQ.md)).  
   Also make sure that `WINDOWS_ASSETS_DIR` points to a valid folder path and
   ends with a backslash.

2. Edit the `example` host entry in [etc/windows.hosts](etc/windows.hosts) and
   set its IP address to the `SERVER_HOST` IP defined in the `.env` file.

3. Copy [bin/webdriver.ps1](bin/webdriver.ps1) and
   [etc/windows.hosts](etc/windows.hosts) to the same folder in the Windows
   machine (e.g. the Desktop).  
   Also copy the files in the `assets` directory to the folder defined as
   `WINDOWS_ASSETS_DIR`.

4. Create a shortcut to `webdriver.ps1` (via "Right-Click" → "Create shortcut"),
   then open the properties dialog for the shortcut (via "Right-Click" →
   "Properties") and set the `Target` property to the following value:

   ```bat
   powershell -ExecutionPolicy ByPass -File webdriver.ps1
   ```

   Click "OK" to save the changes to the shortcut.

5. Double-Click on the webdriver shortcut to setup and start the servers.  
   Allow `nginx` and `MJPEGServer` to communicate on all networks in the Windows
   Defender Firewall dialog.

6. Run the tests with Microsoft Edge:
   ```sh
   docker-compose run --rm wdio edge.js
   ```

### Shutdown

Stop and remove the container set:

```sh
docker-compose down
```

## License

Released under the [MIT license](https://opensource.org/licenses/MIT).

## Author

[Sebastian Tschan](https://blueimp.net/)
