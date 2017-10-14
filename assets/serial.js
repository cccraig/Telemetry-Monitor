const serialport = require('serialport')


// List serial ports and append to dom
let portList = serialport.list((err, ports) => {

    if (err) {
        document.getElementById('alerts').textContent = err.message
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
    
    } else {

        // List the ports in a select element
        ports.forEach(function(port) {

            // Create Option element
            var option = document.createElement("OPTION")

            // Assign the text for it
            option.innerHTML = port.comName;

            // Append to the dom
            document.getElementById('serialports').appendChild(option);
        });
    }
});

// TODO Persist port and baud settings