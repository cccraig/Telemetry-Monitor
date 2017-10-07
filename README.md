# Telemetry Monitor

This is a project intended to make a nice telemetry (and possible control) interface for robots/uavs. It's for a personal project of mine, but the goal is to make it easily configurable so it could be modified for a variety of telemetry options. Essentially, customizable enough to have a custom telemetry/control interface regardless of your specific platform.

### Installation
Make sure you have electron and npm installed and running on your system. An FYI I had trouble getting npm install to work properly (Running Linux Mint 18.2) untill I upgraded nodejs to v6.11.4LTS. I suggest using the electron-quick start test your installation first.

```
git clone https://github.com/cccraig/Telemetry-Monitor.git

cd Telemetry-Monitor

npm install

# You may need to rebuild serialport against Electron's version of nodejs
rm -rf node_modules/serialport/build/* 
node_modules/.bin/electron-rebuild -w serialport -f 
ls node_modules/serialport/build/Release
