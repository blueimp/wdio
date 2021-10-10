<#
Installs and starts a Webdriver server for Edge.
Installs and starts NGINX as reverse proxy for remote Webdriver connections.
Installs and starts MJPEGServer and FFmpeg for screen recordings.
Updates the Windows hosts file with custom entries.

Copyright 2019, Sebastian Tschan
https://blueimp.net

Licensed under the MIT license:
https://opensource.org/licenses/MIT

Resources:
https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/
https://nginx.org/en/docs/windows.html
https://github.com/blueimp/mjpeg-server
https://www.ffmpeg.org/
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
  nginx = '1.21.3'
  ffmpeg = 'autobuild-2021-10-09-12-22/' +
    'ffmpeg-n4.4-178-g4b583e5425-win64-gpl-shared-4.4'
  MJPEGServer = '1.3.0'
}

$downloads = @{
  nginx = 'https://nginx.org/download/nginx-1.21.3.zip' -f $versions.nginx
  msedgedriver = 'https://msedgedriver.azureedge.net/{0}/edgedriver_win64.zip'
  ffmpeg = ('https://github.com/BtbN/FFmpeg-Builds/releases/download/' +
    '{0}.zip') -f $versions.ffmpeg
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

# Returns the Edge version number:
function Get-EdgeVersion {
  $path = 'HKCU:\Software\Microsoft\Edge\BLBeacon'
  Get-ItemProperty $path -ErrorAction SilentlyContinue |
    ForEach-Object version
}

# Installs msedgedriver:
function Install-EdgeDriver {
  $version = Get-EdgeVersion
  if ($version) {
    if (Test-Path bin\msedgedriver.exe) {
      $driverVersion = ($(bin\msedgedriver.exe -v) -split ' ')[1]
      if ($driverVersion -eq $version) {
        return
      }
      Remove-Item bin\msedgedriver.exe
    }
    $url = $downloads.msedgedriver -f $version
    New-Item bin -ItemType Directory -Force
    Clear-Host
    'Installing Microsoft Edge Driver ...'
    Invoke-ZipDownload $url
    Move-Item msedgedriver.exe bin
    Remove-Item Driver_Notes -Recurse
  }
}

# Installs and configures nginx:
function Install-NGINX {
  if (!(Test-Path nginx)) {
    Clear-Host
    'Installing nginx ...'
    Invoke-ZipDownload $downloads.nginx
    Move-Item nginx-* nginx
  }
  if ((Test-Path nginx) -and (Test-Path nginx.conf)) {
    # Bind nginx to all interfaces instead of only localhost:
    (Get-Content nginx.conf) -replace '127.0.0.1:4444', '4444' |
      Set-Content nginx.conf
    Move-Item nginx.conf nginx\conf\nginx.conf -Force
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

# Starts msedgedriver with nginx as reverse proxy as well as MJPEGServer:
function Start-Webdriver {
  Clear-Host
  'Starting servers ...'
  Start-Process msedgedriver '--port=3333'
  Start-Process nginx -WorkingDirectory nginx
  Start-Process MJPEGServer $ffmpegCommand
}

Update-HostsFile
Install-EdgeDriver
Install-NGINX
Install-FFmpeg
Install-MJPEGServer
Update-Path
Start-Webdriver
