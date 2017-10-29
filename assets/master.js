const Settings = require('./settings');
const Gauges = require('./gauges');
const Peripherals = require('./peripherals');
const Communication = require('./communication');
const SerialPort = require('serialport');

var settings = new Settings();
var gauges = new Gauges(settings.settings);
var peripherals = new Peripherals();
var communication = new Communication(settings.store);

SerialPort.list(communication.listPorts)
  .then(function () {
    communication.setDefaultPort();
  }).then(function () {
    communication.openDefaultPort();
  });

setInterval(function () {
  w = Math.random() * 20;

  for (const [name, gauge] of Object.entries(gauges.gaugeList)) {
    gauge.update({ value: w });
  }

  peripherals.simulate();

}, 1000);
