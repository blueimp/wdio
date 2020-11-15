### Internet Explorer

**Please Note:**  
This guide assumes that a system with Windows 10 has been set up.

Microsoft provides
[free Windows 10 virtual machines](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/)
(that expire after 90 days) that can be used to test IE11.

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
   Allow `Microsoft WebDriver`, `nginx` and `MJPEGServer` to communicate on all
   networks in the Windows Defender Firewall dialog.

   If the program window closes before starting the servers, execute the
   PowerShell command from the previous step in a console window to be able to
   read error messages.

8. Run the tests with Internet Explorer:
   ```sh
   docker-compose run --rm wdio conf/internet-explorer.js
   ```
