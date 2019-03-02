# WDIO
Docker setup for [WebdriverIO](https://webdriver.io/) with automatic
screenshots, image diffing and screen recording support for containerized
versions of Chrome and Firefox.

Also includes Webdriver configurations to test an app running in Docker with
Safari Desktop, Safari Mobile and Chrome Mobile via [Appium](http://appium.io/)
and Internet Explorer and Microsoft Edge in a Windows 10 virtual machine.

- [Usage](#usage)
  * [Chrome](#chrome)
  * [Firefox](#firefox)
  * [Safari](#safari)
  * [Mobile Safari](#mobile-safari)
  * [Mobile Chrome](#mobile-chrome)
  * [Internet Explorer](#internet-explorer)
  * [Microsoft Edge](#microsoft-edge)
  * [Shutdown](#shutdown)
- [License](#license)
- [Author](#author)

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

6. Add the `example` host to your `/etc/hosts` file:
   ```sh
   printf '127.0.0.1\t%s\n' example | sudo tee -a /etc/hosts
   ```

7. Open Appium Desktop and click on "Start Server":
   ```sh
   open -a appium
   ```

8. Run the tests with Mobile Safari:
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

8. Start the Android Virtual Device with a custom `/etc/hosts` file:
   ```sh
   bin/android-emulator.sh -hosts etc/android.hosts
   ```

9. Run the tests with Mobile Chrome:
   ```sh
   docker-compose run --rm wdio mobile-chrome
   ```

### Internet Explorer
**Please Note:**  
This guide assumes that a virtual machine with Windows 10 has been set up, e.g.
using the "MSEdge on Win10" image (which also includes Internet Explorer) from
[Microsoft's Free VMs](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/)
site.

To run the tests with Internet Explorer, follow these steps:

1. Set "Change the size of text, apps, and other items" to 100% in Windows
   Display Settings.  
   If the option is grayed out, make sure the virtual machine Graphics
   configuration allows changing the scaling setting (see e.g.
   [Parallels article #123951](https://kb.parallels.com/en/123951)).

2. Make sure the Internet Explorer `Zoom` level is set to `100%` so that
   the native mouse events can be set to the correct coordinates.

3. Edit [ie.js](ie.js) and change the `hostname` property to the IP of the
   Windows virtual machine.

4. Edit the `example` host entry in the `etc/windows.hosts` file and set its IP
   address to the IP of the host system in the subnet shared with the Windows
   virtual machine.

5. Copy [bin/webdriver.ps1](bin/webdriver.ps1) and
   [etc/windows.hosts](etc/windows.hosts) to the same folder in the Windows
   virtual machine (e.g. the Desktop).

6. Create a shortcut to `webdriver.ps1` (via "Right-Click" → "Create shortcut"),
   then open the properties dialog for the shortcut (via "Right-Click" →
   "Properties") and set the `Target` property to the following value:
   ```bat
   powershell -ExecutionPolicy ByPass -File webdriver.ps1
   ```
   Click "OK" to save the changes to the shortcut.

7. Double-Click on the webdriver shortcut to setup and start the servers.  
   Allow `nginx` to communicate on all networks in the Windows Defender Firewall
   dialog.

8. Run the tests with Internet Explorer:
   ```sh
   docker-compose run --rm wdio ie
   ```

### Microsoft Edge
**Please Note:**  
This guide assumes that a virtual machine with Windows 10 has been set up.  
The scripted installation of
[MicrosoftWebDriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/)
also requires `17763` as minimum Windows build version.

To run the tests with Microsoft Edge, follow these steps:

1. Edit [edge.js](edge.js) and change the `hostname` property to the IP of the
   Windows virtual machine.

2. Edit the `example` host entry in the `etc/windows.hosts` file and set its IP
   address to the IP of the host system in the subnet shared with the Windows
   virtual machine.

3. Copy [bin/webdriver.ps1](bin/webdriver.ps1) and
   [etc/windows.hosts](etc/windows.hosts) to the same folder in the Windows
   virtual machine (e.g. the Desktop).

4. Create a shortcut to `webdriver.ps1` (via "Right-Click" → "Create shortcut"),
   then open the properties dialog for the shortcut (via "Right-Click" →
   "Properties") and set the `Target` property to the following value:
   ```bat
   powershell -ExecutionPolicy ByPass -File webdriver.ps1
   ```
   Click "OK" to save the changes to the shortcut.

5. Double-Click on the webdriver shortcut to setup and start the servers.  
   Allow `nginx` to communicate on all networks in the Windows Defender Firewall
   dialog.

6. Run the tests with Microsoft Edge:
   ```sh
   docker-compose run --rm wdio edge
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
