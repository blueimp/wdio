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
