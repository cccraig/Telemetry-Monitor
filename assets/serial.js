const serialport = require('serialport')

serialport.list((err, ports) => {

    if (err) {
        document.getElementById('error').textContent = err.message
        return
    } else {
    // document.getElementById('error').textContent = ''
    }

    if (ports.length === 0) {
        // Create Option element
        var option = document.createElement("OPTION")

        // Assign the text for it
        option.innerHTML = "No ports discovered";

        // Append to the dom
        document.getElementById('serialports').appendChild(option);
    }

    // List the ports in a select element
    options = ports.forEach(function(port) {

        // Create Option element
        var option = document.createElement("OPTION")

        // Assign the text for it
        option.innerHTML = port.comName;

        // Append to the dom
        document.getElementById('serialports').appendChild(option);
    });
});