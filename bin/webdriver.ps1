<#
Installs and starts Webdriver servers for IE and Microsoft Edge on Windows 10.
Installs and starts NGINX as reverse proxy for remote Webdriver connections.
Edits registry properties to configure IE and Microsoft Edge.

Copyright 2019, Sebastian Tschan
https://blueimp.net

Licensed under the MIT license:
https://opensource.org/licenses/MIT

Resources:
https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/
https://github.com/SeleniumHQ/selenium/wiki/InternetExplorerDriver
https://nginx.org/en/docs/windows.html
#>

$versions = @{
  nginx = '1.15.9'
  IEDriver = '3.141.5'
}

$downloads = @{
  nginx = 'https://nginx.org/download/nginx-{0}.zip' -f $versions.nginx
  # Using the 32bit IEDriverServer (64bit version has performance issues).
  # The download URL contains the version number twice.
  # Once as directory with the major.minor version and once in the file name
  # with the full version string:
  IEDriver = 'https://selenium-release.storage.googleapis.com/' +
    '{0}/IEDriverServer_Win32_{1}.zip' `
    -f ($versions.IEDriver.split('.')[0..1] -join '.'),$versions.IEDriver
}

# NGINX configuration as reverse proxy for Edge WebDriver and IEDriverServer:
$nginxConfig = '
worker_processes 1;
events {
  worker_connections 1024;
}
http {
  server {
    listen 4444;
    location / {
      proxy_pass http://localhost:17556;
    }
  }
  server {
    listen 4445;
    location / {
      proxy_pass http://localhost:5555;
    }
  }
}
'

# Stop if a cmdlet fails:
$ErrorActionPreference = 'Stop'

# Runs the given command with Administrator privileges:
function Start-AdminCommand {
  param([String]$command, [String]$params, [String]$reason)
  Clear-Host
  'Requesting Administrator privileges {0}...' -f $reason
  Start-Process $command $params -Verb RunAs -Wait
}

# Runs the given Powershell command with Administrator privileges:
function Start-PowershellAdminCommand {
  param([String]$command, [String]$reason)
  $params = "-ExecutionPolicy ByPass -command $($command -replace '"','\"')"
  Start-AdminCommand powershell $params $reason
}

# Sets a registry DWord property.
# Also creates the parent path if it does not exist:
function Set-RegistryDWord {
  param([String]$path, [String]$name, [int]$value)
  $prop = Get-ItemProperty $path $name -ErrorAction SilentlyContinue
  if (!$prop) {
    if (!(Test-Path $path)) {
      # -Force option is required if the parent path does not exist:
      New-Item $path -Force
    }
    New-ItemProperty $path $name -PropertyType DWord -Value $value
  } elseif ($prop.$name -ne $value) {
    Set-ItemProperty $path $name $value
  }
}

# Edits HKEY_CURRENT_USER (HKCU) registry:
function Edit-CurrentUserRegistry {
  # Set the same Protected Mode for all Internet Zones by copying the property
  # from zone 4 (Restricted Sites) of the default settings (HKLM) to zones 1-4
  # of the user settings (HKCU):
  #
  # Zone | Setting
  # ---- | ---------------------
  # 0    | My Computer
  # 1    | Local Intranet Zone
  # 2    | Trusted sites Zone
  # 3    | Internet Zone
  # 4    | Restricted Sites Zone
  #
  $path = '\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings\Zones'
  # 2500 is the property key for the Protected Mode setting:
  $name = '2500'
  foreach ($zone in @(1, 2, 3, 4)) {
    Copy-ItemProperty "HKLM:$path\4" -Name $name "HKCU:$path\$zone"
  }
  # Enable the driver to maintain a connection to the instance of Internet
  # Explorer it creates:
  $path = 'HKCU:\SOFTWARE\Wow6432Node\Microsoft\Internet Explorer\Main' +
    '\FeatureControl\FEATURE_BFCACHE'
  Set-RegistryDWord $path iexplore.exe 0
  # Path to IE user settings:
  $path = 'HKCU:\Software\Microsoft\Internet Explorer'
  # Disable IE Compatibility View for Intranet Sites:
  Set-RegistryDWord "$path\BrowserEmulation" IntranetCompatibilityMode 0
  # Disable "Preserve Favorites website data":
  Set-RegistryDWord "$path\Privacy" UseAllowList 0
  # Clear IE browsing history on exit:
  Set-RegistryDWord "$path\Privacy" ClearBrowsingHistoryOnExit 1
  # Disable the IE first run page:
  Set-RegistryDWord "$path\Main" DisableFirstRunCustomize 1
  # Path to Microsoft Edge user settings:
  $path = 'HKCU:\Software\Classes\Local Settings\Software\Microsoft\Windows' +
    '\CurrentVersion\AppContainer\Storage' +
    '\microsoft.microsoftedge_8wekyb3d8bbwe\MicrosoftEdge'
  # Clear Microsoft Edge browsing history on exit:
  Set-RegistryDWord "$path\Privacy" ClearBrowsingHistoryOnExit 1
  # Disable the Microsoft Edge first run page:
  Set-RegistryDWord "$path\Main" PreventFirstRunPage 1
}

# Overwrites the Windows hosts file with the file windows.hosts, if available:
function Update-Hosts {
  $newHostsFile = "$(Get-Location)\windows.hosts"
  if (Test-Path $newHostsFile) {
    $hostsFile = "$env:windir\System32\drivers\etc\hosts"
    if ((Get-FileHash $hostsFile).hash -ne (Get-FileHash $newHostsFile).hash) {
      $command = 'Copy-Item "{0}" "{1}"' -f $newHostsFile,$hostsFile
      Start-PowershellAdminCommand $command 'to overwrite the hosts file'
    }
  }
}

# Downloads and extracts a ZIP file provided as URL:
function Invoke-ZipDownload {
  param([String]$url)
  $filename = [IO.Path]::GetRandomFileName() + '.zip'
  Invoke-WebRequest $url -OutFile $filename
  Expand-Archive $filename .
  Remove-Item $filename
}

# Returns the Windows build number:
function Get-WindowsBuildNumber {
  (Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion' `
    'CurrentBuild').CurrentBuild
}

# Installs MicrosoftWebDriver via "Windows Feature on Demand":
function Install-MicrosoftWebDriver {
  # Windows versions before build 17763 do not have MicrosoftWebDriver as
  # "Windows Feature on Demand" and only support older Edge versions.
  # See https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/
  if ((Get-WindowsBuildNumber) -lt 17763) { return }
  if (!(Get-Command MicrosoftWebDriver -ErrorAction SilentlyContinue)) {
    $capabilityName = 'Microsoft.WebDriver~~~~0.0.1.0'
    Start-AdminCommand DISM `
      "/Online /Add-Capability /CapabilityName:$capabilityName" `
      'for WebDriver installation'
  }
}

# Installs IEDriverServer:
function Install-IEDriverServer {
  if (!(Test-Path IEDriverServer.exe)) {
    Clear-Host
    Invoke-ZipDownload $downloads.IEDriver
  }
  Set-Alias IEDriverServer "$(Get-Location)\IEDriverServer.exe"
}

# Installs and configures nginx:
function Install-Nginx {
  if (!(Test-Path nginx)) {
    Clear-Host
    Invoke-ZipDownload $downloads.nginx
    Move-Item nginx-* nginx
    $nginxConfig | Out-File nginx\conf\nginx.conf ASCII
  }
  Set-Alias nginx "$(Get-Location)\nginx\nginx.exe"
}

# Starts nginx, IEDriverServer and MicrosoftWebDriver (if installed).
# Waits for IEDriverServer to close, then sends nginx the stop signal:
function Start-Servers {
  Clear-Host
  '==========================================================='
  'IMPORTANT: Do not close this window manually.'
  'It will close automatically when IEDriverServer is stopped.'
  '==========================================================='
  'Starting servers...'
  if (Get-Command MicrosoftWebDriver -ErrorAction SilentlyContinue) {
    Start-Process MicrosoftWebDriver
  }
  Start-Process nginx -WorkingDirectory nginx
  Start-Process IEDriverServer -Wait
  Start-Process nginx '-s stop' -WorkingDirectory nginx
}

Edit-CurrentUserRegistry
Update-Hosts
Install-MicrosoftWebDriver
Install-IEDriverServer
Install-Nginx
Start-Servers
