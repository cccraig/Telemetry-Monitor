# Telemetry Monitor
Note this project is currently under development and not ready for active use.

This is a project intended to make a nice telemetry (and possible control) interface for robots/uavs. It's for a personal project of mine, but the goal is to make it easily configurable so it could be modified for a variety of telemetry options. Essentially, customizable enough to have a custom telemetry/control interface regardless of your specific platform.

### Installation
Make sure you have electron and npm installed and running on your system. An FYI I had trouble getting npm install to work properly (Running Linux Mint 18.2) untill I upgraded nodejs to v6.11.4LTS. I suggest using the electron-quick start to test your installation first.

```
git clone https://github.com/cccraig/Telemetry-Monitor.git

cd Telemetry-Monitor

npm install
```

If the installation fails, saying something like "failed at electron-rebuild", try installing nodejs 6.11.4LTS. More information is available [here](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions), but I've included the necessary terminal commands for completeness.
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

It's also possible you are missing build tools.
```
sudo apt-get install -y build-essential
```

#### Rebuilding serialport
You may need to rebuild serialport to use the version of nodejs included with Electron instead of the system version. This **should** be done automatically when you run ```npm install``` on a fresh clone. If not, the following (or something similar) should work. It removes the existing serial port binaries, then rebuilds them against the local version of nodejs in electron.
```
rm -rf node_modules/serialport/build/*
node_modules/.bin/electron-rebuild -w serialport -f
ls node_modules/serialport/build/Release
```
