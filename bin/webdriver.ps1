<#
Installs and starts Webdriver servers for Edge (New+Legacy) & IE on Windows 10.
Installs and starts NGINX as reverse proxy for remote Webdriver connections.
Installs and starts MJPEGServer and FFmpeg for screen recordings.
Edits registry properties to configure Edge Legacy and IE.
Updates Windows hosts file with custom entries.

Copyright 2019, Sebastian Tschan
https://blueimp.net

Licensed under the MIT license:
https://opensource.org/licenses/MIT

Resources:
https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/
https://github.com/SeleniumHQ/selenium/wiki/InternetExplorerDriver
https://nginx.org/en/docs/windows.html
#>

[Diagnostics.CodeAnalysis.SuppressMessageAttribute(
  'PSUseShouldProcessForStateChangingFunctions', ''
)]
[Diagnostics.CodeAnalysis.SuppressMessageAttribute(
  'PSAvoidUsingPositionalParameters', ''
)]
param()

$ErrorActionPreference = 'Stop' # Stop if a cmdlet fails

$ffmpegOptions = @{
  fps = '15'
  quality = '2' # Value between 2 (best) and 31 (worst)
}

$versions = @{
  nginx = '1.17.9'
  IEDriver = '3.150.1'
  ffmpeg = '4.2.2'
  MJPEGServer = '1.2.0'
}

$downloads = @{
  nginx = 'https://nginx.org/download/nginx-{0}.zip' -f $versions.nginx
  msedgedriver = 'https://msedgedriver.azureedge.net/{0}/edgedriver_win64.zip'
  # Using the 32bit IEDriverServer (64bit version has performance issues).
  # The download URL contains the version number twice.
  # Once as directory with the major.minor version and once in the file name
  # with the full version string:
  IEDriver = ('https://selenium-release.storage.googleapis.com/' +
    '{0}/IEDriverServer_Win32_{1}.zip') `
    -f ($versions.IEDriver.split('.')[0..1] -join '.'),$versions.IEDriver
  ffmpeg = ('https://ffmpeg.zeranoe.com/builds/win64/static/' +
    'ffmpeg-{0}-win64-static.zip') -f $versions.ffmpeg
  MJPEGServer = ('https://github.com/blueimp/mjpeg-server/releases/download/' +
    'v{0}/mjpeg-server-windows-amd64.zip') -f $versions.MJPEGServer
}

$ffmpegCommand = ('ffmpeg' +
  ' -loglevel error' +
  ' -probesize 32' +
  ' -fpsprobesize 0' +
  ' -analyzeduration 0' +
  ' -fflags nobuffer' +
  ' -f gdigrab' +
  ' -r {0}' +
  ' -i desktop' +
  ' -f mpjpeg' +
  ' -q {1}' +
  ' -') -f $ffmpegOptions.fps,$ffmpegOptions.quality

# NGINX configuration as reverse proxy for Edge WebDriver and IEDriverServer:
$nginxConfig = '
worker_processes 1;
events {
  worker_connections 1024;
}
http {
  server {
    listen 4445;
    location / {
      proxy_pass http://localhost:5555;
    }
  }
  server {
    listen 4446;
    location / {
      proxy_pass http://localhost:17556;
    }
  }
}
'

# Relative install paths to add to the PATH environment variable:
$installPaths = @('bin', 'nginx', 'ffmpeg\bin')

# Runs the given command with Administrator privileges:
function Invoke-AdminCommand {
  param([String]$command, [String]$params, [String]$reason)
  Clear-Host
  'Requesting Administrator privileges {0}...' -f $reason
  Start-Process $command $params -Verb RunAs -Wait
}

# Runs the given Powershell command with Administrator privileges:
function Invoke-PowershellAdminCommand {
  param([String]$command, [String]$reason)
  $params = "-ExecutionPolicy ByPass -command $($command -replace '"','\"')"
  Invoke-AdminCommand powershell $params $reason
}

# Sets a registry property.
# Also creates the parent path if it does not exist:
function Set-RegistryProperty {
  param([String]$path, [String]$name, [String]$type, $value)
  $prop = Get-ItemProperty $path $name -ErrorAction SilentlyContinue
  if (!$prop) {
    if (!(Test-Path $path)) {
      # -Force option is required if the parent path does not exist:
      New-Item $path -Force
    }
    New-ItemProperty $path $name -PropertyType $type -Value $value
  } elseif ($prop.$name -ne $value) {
    Set-ItemProperty $path -Name $name $value
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
  Set-RegistryProperty $path iexplore.exe DWord 0
  # Path to IE user settings:
  $path = 'HKCU:\Software\Microsoft\Internet Explorer'
  # Disable IE Compatibility View for Intranet Sites:
  Set-RegistryProperty "$path\BrowserEmulation" IntranetCompatibilityMode `
    DWord 0
  # Disable "Preserve Favorites website data":
  Set-RegistryProperty "$path\Privacy" UseAllowList DWord 0
  # Clear IE browsing history on exit:
  Set-RegistryProperty "$path\Privacy" ClearBrowsingHistoryOnExit DWord 1
  # Disable the IE first run page:
  Set-RegistryProperty "$path\Main" DisableFirstRunCustomize DWord 1
  # Start IE with a blank page:
  Set-RegistryProperty "$path\Main" 'Start Page' String 'about:blank'
  # Open new tabs in IE with a blank page:
  Set-RegistryProperty "$path\TabbedBrowsing" NewTabPageShow DWord 0
  # Path to Microsoft Edge user settings:
  $path = 'HKCU:\Software\Classes\Local Settings\Software\Microsoft\Windows' +
    '\CurrentVersion\AppContainer\Storage' +
    '\microsoft.microsoftedge_8wekyb3d8bbwe\MicrosoftEdge'
  # Clear Microsoft Edge browsing history on exit:
  Set-RegistryProperty "$path\Privacy" ClearBrowsingHistoryOnExit DWord 1
  # Disable the Microsoft Edge first run page:
  Set-RegistryProperty "$path\Main" PreventFirstRunPage DWord 1
  # Disable the Microsoft Edge default browser prompt:
  Set-RegistryProperty "$path\Main" DisallowDefaultBrowserPrompt DWord 1
  # Set tbe Microsoft Edge home page to the new tab page:
  Set-RegistryProperty "$path\Main" HomeButtonPage String 'about:tabs'
  # Open new tabs in Microsoft Edge with a blank page:
  Set-RegistryProperty "$path\ServiceUI" NewTabPageDisplayOption DWord 2
}

# Overwrites the Windows hosts file with the file windows.hosts, if available:
function Update-HostsFile {
  $newHostsFile = "$(Get-Location)\windows.hosts"
  if (Test-Path $newHostsFile) {
    $hostsFile = "$env:windir\System32\drivers\etc\hosts"
    if ((Get-FileHash $hostsFile).hash -ne (Get-FileHash $newHostsFile).hash) {
      $command = 'Copy-Item "{0}" "{1}"' -f $newHostsFile,$hostsFile
      Invoke-PowershellAdminCommand $command 'to overwrite the hosts file'
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

# Returns the Edge version number:
function Get-EdgeVersion {
  $path = 'HKLM:\SOFTWARE\Wow6432node\Microsoft\Windows\CurrentVersion' +
    '\Uninstall\Microsoft Edge'
  Get-ItemProperty $path -ErrorAction SilentlyContinue |
    ForEach-Object DisplayVersion
}

# Installs msedgedriver:
function Install-EdgeDriver {
  if (!(Test-Path bin\msedgedriver.exe)) {
    $version = Get-EdgeVersion
    if ($version) {
      $url = $downloads.msedgedriver -f $version
      New-Item bin -ItemType Directory -Force
      Clear-Host
      'Installing Microsoft Edge Driver ...'
      Invoke-ZipDownload $url
      Move-Item msedgedriver.exe bin
      Remove-Item Driver_Notes -Recurse
    }
  }
}

# Installs MicrosoftWebDriver (for Edge Legacy) via "Windows Feature on Demand":
function Install-MicrosoftWebDriver {
  # Windows versions before build 17763 do not have MicrosoftWebDriver as
  # "Windows Feature on Demand" and only support older Edge versions.
  # See https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/
  if ((Get-WindowsBuildNumber) -lt 17763) { return }
  if (!(Get-Command MicrosoftWebDriver -ErrorAction SilentlyContinue)) {
    $capabilityName = 'Microsoft.WebDriver~~~~0.0.1.0'
    Invoke-AdminCommand DISM `
      "/Online /Add-Capability /CapabilityName:$capabilityName" `
      'for Edge Legacy WebDriver installation'
  }
}

# Installs IEDriverServer:
function Install-IEDriverServer {
  if (!(Test-Path bin\IEDriverServer.exe)) {
    New-Item bin -ItemType Directory -Force
    Clear-Host
    'Installing IEDriverServer ...'
    Invoke-ZipDownload $downloads.IEDriver
    Move-Item IEDriverServer.exe bin
  }
}

# Installs and configures nginx:
function Install-NGINX {
  if (!(Test-Path nginx)) {
    Clear-Host
    'Installing nginx ...'
    Invoke-ZipDownload $downloads.nginx
    Move-Item nginx-* nginx
    $nginxConfig | Out-File nginx\conf\nginx.conf ASCII
  }
}

# Installs ffmpeg:
function Install-FFmpeg {
  if (!(Test-Path ffmpeg)) {
    Clear-Host
    'Installing ffmpeg ...'
    Invoke-ZipDownload $downloads.ffmpeg
    Move-Item ffmpeg-* ffmpeg
  }
}

# Installs MJPEGServer:
function Install-MJPEGServer {
  if (!(Test-Path bin\MJPEGServer.exe)) {
    New-Item bin -ItemType Directory -Force
    Clear-Host
    'Installing MJPEGServer ...'
    Invoke-ZipDownload $downloads.MJPEGServer
    Move-Item MJPEGServer.exe bin
  }
}

# Updates the PATH environment variable with the installed program paths:
function Update-Path {
  $currentPath = $(Get-Location)
  $originalEnvPath = $env:Path
  $pathComponents = $originalEnvPath.TrimEnd(';') -split ';'
  foreach ($path in $installPaths) {
    if ($pathComponents -notcontains "$currentPath\$path") {
      $pathComponents += "$currentPath\$path"
    }
  }
  $env:Path = ($pathComponents -join ';') + ';'
  if ($env:Path -ne $originalEnvPath) {
    [Environment]::SetEnvironmentVariable(
      'Path',
      $env:Path,
      [System.EnvironmentVariableTarget]::User
    )
  }
}

# Starts nginx, IEDriverServer and MicrosoftWebDriver (if installed).
# Waits for IEDriverServer to close, then sends nginx the stop signal:
function Start-Service {
  Clear-Host
  '========================================================'
  'IMPORTANT: Do not close this window manually.'
  'It will close automatically when MJPEGServer is stopped.'
  '========================================================'
  'Starting servers ...'
  if (Get-Command msedgedriver -ErrorAction SilentlyContinue) {
    Start-Process msedgedriver '--port=4444 --whitelisted-ips='
  }
  if (Get-Command MicrosoftWebDriver -ErrorAction SilentlyContinue) {
    Start-Process MicrosoftWebDriver
  }
  Start-Process IEDriverServer
  Start-Process nginx -WorkingDirectory nginx
  Start-Process MJPEGServer $ffmpegCommand -Wait
  Start-Process nginx '-s stop' -WorkingDirectory nginx
}

Edit-CurrentUserRegistry
Update-HostsFile
Install-MicrosoftWebDriver
Install-EdgeDriver
Install-IEDriverServer
Install-NGINX
Install-FFmpeg
Install-MJPEGServer
Update-Path
Start-Service
