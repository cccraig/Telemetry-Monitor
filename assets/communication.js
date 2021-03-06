const SerialPort = require('serialport');

// Create a mock port for testing
const TestSerial = require('serialport/test');
const MockBinding = TestSerial.Binding;
MockBinding.createPort('/dev/ROBOT', { echo: true, record: true });

class Communication {

  constructor(store, gaugeObj, peripheralObj) {
    this.store = store;
    this.defaultPort = store.defaultPort;
    this.gaugeObj = gaugeObj;
    this.peripheralObj = peripheralObj;
    this.indicator = false;
  }

  listPorts(err, ports) {
    if (err) {
      Communication.msg({ msg: 'two' });
      return;
    }

    if (ports.length === 0) {
      Communication.populateComList({ comName: 'No Ports Discovered' });
      return;
    }

    ports.forEach(function (port, key) {
      Communication.populateComList(port, key);
    });
  }

  setDefaultPort() {
    // Specify an onchange event for serial port and baud rate
    document.getElementById('serialports').onchange = this.updateSerialPort.bind(this);
    document.getElementById('bauds').onchange = this.updateSerialPort.bind(this);

    // Select the default port
    if (this.defaultPort === undefined) {
      let portBox = document.getElementById('serialports');
      let baudBox = document.getElementById('bauds');
      let com = portBox.options[portBox.selectedIndex].value;
      let baud = baudBox.options[baudBox.selectedIndex].value;
      let update = {
        port: com,
        baud: baud,
        portIndex: portBox.selectedIndex,
        baudIndex: baudBox.selectedIndex,
      };

      this.defaultPort = update;

      this.store.set('defaultPort', update);

    } else {
      let comIndex = this.defaultPort.portIndex;
      let baudIndex = this.defaultPort.baudIndex;

      document.getElementById('serialports').selectedIndex = comIndex;
      document.getElementById('bauds').selectedIndex = baudIndex;
    }
  }

  indicate(x=false) {
    document.getElementById('signal').className = x ? 'led-green' : 'led-yellow';
  }

  openDefaultPort() {
    let com = this.defaultPort.port;
    let baud = this.defaultPort.baud;
    this.parser = new SerialPort.parsers.Readline();

    this.port = new SerialPort(com, { baudRate: parseInt(baud) }, Communication.msg);
    this.port.pipe(this.parser);
    this.parser.on('open', this.indicate.bind(this, 1));
    this.parser.on('data', this.parse.bind(this));
  }

  updateSerialPort() {
    let portBox = document.getElementById('serialports');
    let com = portBox.options[portBox.selectedIndex].value;

    let baudBox = document.getElementById('bauds');
    let baud = baudBox.options[baudBox.selectedIndex].value;

    let update = {
      port: com,
      baud: baud,
      portIndex: portBox.selectedIndex,
      baudIndex: baudBox.selectedIndex,
    };

    this.defaultPort = update;

    this.store.set('defaultPort', update);

    if (this.port.isOpen) {
      this.port.close(this.msg);
    }

    this.openDefaultPort();
  }

  static msg(err) {
    if (err !== null && err.msg !== undefined) {
      err = err.msg;
    }

    document.getElementById('error_msg').value = err;
    document.getElementById('signal').className = 'led-yellow';
  }

  parse(data) {
    try {
      data = JSON.parse(data);
      let peripherals = data.peripherals;
      let motors = peripherals.motors;
      let system = data.system;

      for (const [name, gauge] of Object.entries(this.gaugeObj.gaugeList)) {
        gauge.update({ value: system[name] });
      }

      if (this.indicator) {
        let n = this.peripheralObj.series[0].length;

        for (var i = 0; i < this.peripheralObj.series.length; i++) {
          if (n == 30) {
            this.peripheralObj.series[i].shift();
          }

          this.peripheralObj.series[i].push(motors['motor_' + i].amperage);
        }

        this.peripheralObj.update();

        // this.peripheralObj.update();
      } else {
        this.indicator = true;
      }
    } catch (e) {
      console.log(e);
    }
  }

  static populateComList(port, val=0) {
    // Create Option element
    let option = document.createElement('OPTION');

    // Assign the text
    option.innerHTML = port.comName;

    // Assign a value
    option.value = port.comName;

    // Append to the dom
    document.getElementById('serialports').appendChild(option);
  }
}

module.exports = Communication;
