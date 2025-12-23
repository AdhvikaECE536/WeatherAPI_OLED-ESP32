const { SerialPort } = require('serialport');

// List all connected serial devices
SerialPort.list().then((ports) => {
  console.log('Available ports:');
  
  if (ports.length === 0) {
    console.log('No ports found! Make sure ESP32 is plugged in.');
  } else {
    ports.forEach((port) => {
      console.log(`- ${port.path}`);
      if (port.manufacturer) {
        console.log(`  Manufacturer: ${port.manufacturer}`);
      }
    });
  }
});
