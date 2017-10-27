// Simple functions to produce fake data for testing
var interval = 1000;
var min = 5;
var max = 20;
var f = (function() {
  return ((Math.random() * max) + min);
});

setInterval(function() {
  let data = {
    "heading": f(),
    "power": f(),
    "temperature": f(),
    "speed": f(),
    "peripherals": {
      "motor_1": {
        "amperage": f(),
        "voltage": f(),
        "speed": f()
      },
      "motor_2": {
        "amperage": f(),
        "voltage": f(),
        "speed": f()
      },
      "gps": {
        "latitude": f(),
        "longitude": f(),
        "elevation": f(),
        "satellites": f()
      },
      "air_temp": f(),
      "barometer": f()
    }
  }
  console.log(data.heading);
}, interval);
