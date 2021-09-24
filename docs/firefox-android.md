### Firefox on Android

To run the tests with Firefox on Android:

1. Follow steps 1-4 in the [Chrome on Android](chrome-android.md) guide.

2. Install the latest Mozilla Firefox for Android version:

   - Download the latest
     [Mozilla Firefox APK](https://www.apkmirror.com/apk/mozilla/firefox/)
     (Android Application Package) for the architecture of your emulated device
     (`x86`).
   - Drag&drop the APK file into the emulator window to install it or install it
     via command-line:
     ```sh
     adb install org.mozilla.firefox_*.apk
     ```

3. Install [geckodriver](https://github.com/mozilla/geckodriver) and
   [NGINX](https://nginx.org/) via [Homebrew](https://brew.sh/):

   ```sh
   brew install geckodriver nginx
   ```

4. Start `geckodriver` with `nginx` as reverse proxy:

   ```sh
   bin/geckodriver.sh
   ```

5. Run the tests with Firefox on Android:

   ```sh
   docker-compose run --rm wdio conf/firefox-android.js
   ```
