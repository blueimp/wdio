### Mobile Chrome

To run the tests with Mobile Chrome on Android Simulator, follow these steps:

1. Download [Android Studio](https://developer.android.com/studio/) (release
   version "Arctic Fox" at the time of this writing) and on the welcome dialog,
   select "More Actions" => "SDK Manager", then switch to the "SDK Tools" tab
   and install the following components (if not already installed):

   - Android SDK Command-line Tools
   - Android Emulator
   - Android SDK Platform-Tools
   - Intel x86 Emulator Accelerator (HAXM installer)

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
   Android Studio and the installed Android SDK available to other applications:

   ```sh
   export JAVA_HOME='/Applications/Android Studio.app/Contents/jre/Contents/Home'
   export PATH="$JAVA_HOME/bin:$PATH"
   export ANDROID_HOME=~/Library/Android/sdk
   ```

3. Start the Android Virtual Device with a custom `/etc/hosts` file:

   ```sh
   bin/android-emulator.sh -hosts etc/android.hosts
   ```

4. Change the virtual device settings to enable a hardware keyboard and increase
   the internal storage:

   - In Android Studio on the welcome dialog, select "More Actions" => "AVD
     Manager", then with a right mouse click on your listed Virtual Device,
     bring up the menu and select "Edit".
   - Click on the "Show Advanced Settings" button to be able to see all
     settings.
   - Scroll to the "Memory and Storage" section and change the value of
     "Internal Storage" to `2048` (MB).
   - Scroll to the bottom of the configuration pane and mark the checkbox for
     "Enable keyboard input".
   - Click the "Finish" button and restart the virtual device.

5. Install the latest Google Chrome for Android version:

   - Download the latest
     [Google Chrome APK](https://www.apkmirror.com/apk/google-inc/chrome/)
     (Android Application Package) for the architecture of your emulated device
     (`x86`).
   - Drag&drop the APK file into the emulator window to install it or install it
     via command-line:
     ```sh
     adb install com.android.chrome_*.apk
     ```

6. Install [Node.JS](https://nodejs.org/) via [Homebrew](https://brew.sh/):

   ```sh
   brew install node
   ```

7. Make sure the necessary [Appium](https://appium.io/) dependencies for Android
   testing are installed:

   ```sh
   npx appium-doctor --android
   ```

8. Install [Appium](https://appium.io/) as global NPM package:

   ```sh
   npm install -g appium
   ```

9. Start `appium` with the provided helper script:

   ```sh
   bin/appium.sh
   ```

   This script is configured for
   [Automatic discovery of compatible Chromedriver](https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/web/chromedriver.md/#automatic-discovery-of-compatible-chromedriver)
   and will download a `chromedriver` version compatible with the version of
   Chrome running on the Android device.

10. Run the tests with Mobile Chrome:

    ```sh
    docker-compose run --rm wdio conf/mobile-chrome.js
    ```

    To run the tests in landscape orientation, provide the `ORIENTATION`
    environment variable:

    ```sh
    ORIENTATION=LANDSCAPE docker-compose run --rm wdio conf/mobile-chrome.js
    ```
