### Edge

**Please Note:**  
This guide assumes that a system with Windows 10 or later has been set up and
the [Microsoft Edge](https://www.microsoft.com/en-us/edge) browser has been
installed.

To run the tests with Edge, follow these steps:

1. Create a `.env` file in the same directory as
   [../docker-compose.yml](../docker-compose.yml) and add the following
   environment variables:

   ```sh
   SERVER_HOST=<DOCKER_HOST_IP>
   SERVER_PORT=8080
   WINDOWS_HOST=<WINDOWS_HOST_IP>
   WINDOWS_ASSETS_DIR=C:\Users\<USERNAME>\Desktop\assets\
   ```

   Make sure that the `DOCKER_HOST_IP` is accessible from the Windows machine
   and the `WINDOWS_HOST_IP` is accessible from a Docker container.  
   Also make sure that `WINDOWS_ASSETS_DIR` points to a valid folder path and
   ends with a backslash.

2. Edit the `example` host entry in [../etc/windows.hosts](../etc/windows.hosts)
   and set its IP address to the `SERVER_HOST` IP defined in the `.env` file.

3. Copy [../bin/webdriver.ps1](../bin/webdriver.ps1),
   [../etc/windows.hosts](../etc/windows.hosts) and
   [../etc/nginx.conf](../etc/nginx.conf) to the same folder in the Windows
   machine (e.g. the Desktop).  
   Also copy the files in the [../assets](../assets) directory to the folder
   defined as `WINDOWS_ASSETS_DIR`.

4. Create a shortcut to `webdriver.ps1` (via "Right-Click" → "Create shortcut"
   on Windows 10 and "Right-Click" → "Show more options" → "Create shortcut" on
   Windows 11), then open the properties dialog for the shortcut (via
   "Right-Click" → "Properties") and set the `Target` property to the following
   value:

   ```bat
   powershell -ExecutionPolicy ByPass -File webdriver.ps1
   ```

   Click "OK" to save the changes to the shortcut.

5. Double-Click on the webdriver shortcut to setup and start the servers.

   Confirm the dialog to "allow this app to make changes to your device", so it
   can edit the Windows hosts file (this dialog only appears if a
   `windows.hosts` file is present in the same directory).

   Allow `nginx` and `MJPEGServer` to communicate on all networks in the Windows
   Defender Firewall dialog.

   **Please Note:**  
   If the program window closes before starting the servers, execute the
   PowerShell command from the previous step in a console window to be able to
   read error messages.

6. Install [NGINX](https://nginx.org/) via [Homebrew](https://brew.sh/):

   ```sh
   brew install nginx
   ```

7. Start `nginx` as reverse proxy for the application server and allow `nginx`
   to accept incoming network connections in the macOS Firewall dialog:

   ```sh
   bin/reverse-proxy.sh
   ```

   **Please Note:**  
   This is a workaround to access the application container on the Docker host
   from the Windows machine without having to disable the macOS firewall.

8. Run the tests with Edge:
   ```sh
   docker-compose run --rm wdio conf/edge.js
   ```
