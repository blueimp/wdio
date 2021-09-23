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
   and [NGINX](https://nginx.org/) via [Homebrew](https://brew.sh/):

   ```sh
   brew install ffmpeg nginx
   ```

3. Add the `example` host to your `/etc/hosts` file:

   ```sh
   printf '127.0.0.1\t%s\n' example | sudo tee -a /etc/hosts
   ```

4. Start `safaridriver`, `nginx` and `mjpeg-server` with the provided helper
   script:

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
   docker-compose run --rm wdio conf/safari.js
   ```
