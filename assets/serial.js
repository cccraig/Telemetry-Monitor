const SerialPort = require('serialport')
const Store = require('electron-store');
const store = new Store()
const defaultConnection = store.get('default_serial');

// Update the serial port connection
var updateSerialPort = function(obj) {

  let portBox = document.getElementById('serialports');
  let port = portBox.options[portBox.selectedIndex].value;

  let baudBox = document.getElementById('bauds');
  let baud = baudBox.options[baudBox.selectedIndex].value;

  let update = {
    "port":port,
    "baud":baud,
    "port_index": portBox.selectedIndex,
    "baud_index": baudBox.selectedIndex
  }

  store.set('default_serial', update);
}


// Update the baud rate
var updateBaudRate = function() {
    console.log("working");
}


// Do something when data arrives
var parseIncomingData = function(data) {
    console.log(data);
}


var displayError = function(err) {
    document.getElementById('error_msg').value = err.message;
    console.log(err);
}

// List serial ports and append to dom
SerialPort.list((err, ports) => {

    if (err) {
        document.getElementById('error_msg').value = err.message; return;
    }

    if (ports.length === 0) {
        // Create Option element
        var option = document.createElement("OPTION")

        // Assign the text
        option.innerHTML = "No ports discovered";

        // Assign a value
        option.value = 0;

        // Append to the dom
        document.getElementById('serialports').appendChild(option);

    } else {

        // List the ports in a select element
        ports.forEach(function(port, key) {

            // Create Option element
            var option = document.createElement("OPTION")

            // Assign the text
            option.innerHTML = port.comName;

            // Assign a value
            option.value = port.comName;

            // Append to the dom
            document.getElementById('serialports').appendChild(option);
        });

        // Specify an onchange event for serial port
        document.getElementById('serialports').onchange = updateSerialPort;

        // Specify an onchange event for baud rate
        document.getElementById('bauds').onchange = updateSerialPort;
    }

}).then(function() {

    // Open the default port or create one
    if(defaultConnection === undefined) {

        let port = document.getElementById('serialports').options[0].value;
        var dps = {"port": port, "baud":9600, "port_index":0, "baud_index":0}
        store.set('default_serial', dps);

    } else {

        var dps = store.get('default_serial');
        document.getElementById('serialports').options.selectedIndex = dps["port_index"]
        document.getElementById('bauds').options.selectedIndex = dps["baud_index"]

    }

    const activePort = new SerialPort(dps["port"], baudRate=dps["baud"], displayError);
    const Readline = SerialPort.parsers.Readline;
    const parser = activePort.pipe(new Readline());
    parser.on('data', parseIncomingData);
});
