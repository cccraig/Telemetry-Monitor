const Settings = require('./settings');
const Gauges = require('./gauges');
const Peripherals = require('./peripherals');
const Communication = require('./communication');
const Faker = require('./faker');
const SerialPort = require('serialport');

var settings = new Settings();
var gauges = new Gauges(settings.settings);
var peripherals = new Peripherals();
var communication = new Communication(
  settings.store,
  gauges,
  peripherals
);

var faker = new Faker();

SerialPort.list(communication.listPorts)
  .then(function () {
    communication.setDefaultPort();
  }).then(function () {
    communication.openDefaultPort();
  }).then(function () {
    setInterval(function () {
      faker.start();
      communication.port.write(JSON.stringify(faker.data) + '\n');
    }, 1000);
  });
