const SerialPort = require('serialport');
const store = global.app_special_user_settings;
const defaultPort = store.get('default_serial');

// Create a mock port for testing
const TestSerial = require('serialport/test');
const MockBinding = SerialPort.Binding;
MockBinding.createPort('/dev/ROBOT', { echo: true, record: true });

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
    document.getElementById('serialports').onchange = this.updateSerialPort.bind(this);
    document.getElementById('bauds').onchange = this.updateSerialPort.bind(this);

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

  indicate(x=false) {
    document.getElementById("signal").className = x ? "led-green" : "led-yellow";
  }


  openDefaultPort() {
    let com = this.defaultPort["port"];
    let baud = this.defaultPort["baud"];
    let parser = new SerialPort.parsers.Readline();

    this.port = new SerialPort(com, {"baudRate":parseInt(baud)}, Communication.msg);
    this.port.pipe(parser);
    this.port.on('open', this.indicate.bind(this, 1));
    this.port.on('ready', ()=> {console.log("i'm ready")});
    this.port.on('data', ()=>{console.log("Ready/n")});
    this.port.write('respond\n');
  }


  updateSerialPort() {
    let portBox = document.getElementById('serialports');
    let com = portBox.options[portBox.selectedIndex].value;

    let baudBox = document.getElementById('bauds');
    let baud = baudBox.options[baudBox.selectedIndex].value;

    let update = {
      "port":com,
      "baud":baud,
      "port_index": portBox.selectedIndex,
      "baud_index": baudBox.selectedIndex
    }

    this.defaultPort = update

    store.set('default_serial', update);

    if(this.port.isOpen) {
      this.port.close(this.msg);
    }

    this.openDefaultPort();
  }


  static msg(err) {
    if(err !== null && err.msg !== undefined) {
      err = err.msg;
    }
    document.getElementById('error_msg').value = err;

    document.getElementById("signal").className = "led-yellow";

    // console.log(err)
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
