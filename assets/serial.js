const SerialPort = require('serialport')
const Store = require('electron-store');
const store = new Store()
const defaultPort = store.get('default_serial');


class Communication {

  constructor(defaultPort) {
    this.defaultPort = defaultPort;
  }


  listPorts(err, ports) {
    if(err) {Communication.msg({"msg":'two'}); return;};

    if(ports.length === 0) {Communication.populateComList({comName:"No Ports Discovered"}); return;};

    ports.forEach(function(port,key){Communication.populateComList(port, key)});
  }


  setDefaultPort() {
    // Specify an onchange event for serial port and baud rate
    document.getElementById('serialports').onchange = Communication.updateSerialPort;
    document.getElementById('bauds').onchange = Communication.updateSerialPort;

    // Select the default port
    if(this.defaultPort === undefined) {
      let portBox = document.getElementById('serialports');
      let baudBox = document.getElementById('bauds');
      let com = portBox.options[portBox.selectedIndex].value;
      let baud = baudBox.options[baudBox.selectedIndex].value;
      let update = {
        "port":com,
        "baud":baud,
        "port_index": portBox.selectedIndex,
        "baud_index": baudBox.selectedIndex
      };

      this.defaultPort = update;

      store.set('default_serial', update);

    } else {
      let com_index = this.defaultPort['port_index'];
      let baud_index = this.defaultPort['baud_index'];

      document.getElementById('serialports').selectedIndex = com_index;
      document.getElementById('bauds').selectedIndex = baud_index;
    }
  }


  openDefaultPort() {
    let com = this.defaultPort["port"];
    let baud = this.defaultPort["baud"];
    let parser = new SerialPort.parsers.Readline();

    this.port = new SerialPort(com, {"baudRate":parseInt(baud)}, Communication.msg);
    this.port.pipe(new SerialPort.parsers.Readline());
    parser.on('data', console.log);
    this.port.write('respond\n');
  }


  static updateSerialPort() {
    let portBox = document.getElementById('serialports');
    let port = portBox.options[portBox.selectedIndex].value;

    let baudBox = document.getElementById('bauds');
    let baud = baudBox.options[baudBox.selectedIndex].value;
    console.log(portBox.selectedIndex)
    let update = {
      "port":port,
      "baud":baud,
      "port_index": portBox.selectedIndex,
      "baud_index": baudBox.selectedIndex
    }

    store.set('default_serial', update);
  }


  static msg(err) {
    if(err.msg !== undefined) {
      err = err.msg;
    }
    document.getElementById('error_msg').value = err;
    console.log(err)
  }


  static populateComList(port, val=0) {
    // Create Option element
    let option = document.createElement("OPTION")

    // Assign the text
    option.innerHTML = port.comName;

    // Assign a value
    option.value = port.comName;

    // Append to the dom
    document.getElementById('serialports').appendChild(option);
  }
}


let Radio = new Communication(defaultPort);

SerialPort.list(Radio.listPorts)
  .then(function() {
    Radio.setDefaultPort();
  }).then(function() {
    Radio.openDefaultPort();
  });
