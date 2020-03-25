### Mobile Chrome

To run the tests with Mobile Chrome on Android Simulator, follow these steps:

1. Download [Android Studio](https://developer.android.com/studio/) and on first
   start, follow the instructions to install the Android SDK and Emulator.

   **Please Note:**  
   To be able to use a custom `/etc/hosts` file requires mounting the root file
   system as writable, which requires a supported system image for the Android
   Virtual Device (AVD), e.g.:

   > Android 9 "Pie" (Google APIs)

   System images for Android 10 "Q" or system images including the Google Play
   store do not support mounting the root file system as writable.  
   See also John Wu's
   [Twitter post](https://twitter.com/topjohnwu/status/1170404631865778177) on
   Android 10's file system format.

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
