// including the express library & creating the web server "App"
const Express = require('express');
const App = Express();

const Port = 3000;

// connecting to ESP32
const {SerialPort} = require('serialport');

const esp32 = new SerialPort({
  path : 'COM8',
  baudRate : 115200  
});

esp32.on('open', () => {
  console.log('✅ ESP32 connected on COM8');
});

esp32.on('error', (err) => {
  console.log('❌ Serial Port Error:', err.message);
});

// to get full-line data
const {ReadlineParser} = require('@serialport/parser-readline');
const Parser = esp32.pipe(new ReadlineParser({delimiter: '\n'}));

Parser.on('data',(data) => {
  console.log('📡 Weather station:', data);
});

// serve static files from the public folder & json files
App.use(Express.static('public'));
App.use(Express.json());

// API endpoint to change screen view
App.get('/screen/:view', (req, res) => {
  const view = req.params.view;
  console.log('🖥️  SCREEN CHANGE REQUEST:', view);
  
  // Send the command that matches ESP32 expectations
  esp32.write(`${view}\n`, (err) => {
    if (err) {
      console.log('❌ Error writing to ESP32:', err.message);
      res.json({success: false, error: err.message});
    } else {
      console.log('✅ Screen changed to:', view);
      res.json({success: true});
    }
  });
});

// API endpoint to update location
App.post('/location', (req, res) => {
  const {lat, lon} = req.body;
  console.log('📍 LOCATION UPDATE REQUEST:', lat, lon);
  
  if (!lat || !lon) {
    return res.json({success: false, error: 'Missing latitude or longitude'});
  }
  
  // Send location in format ESP32 expects: LOC:lat,lon
  esp32.write(`LOC:${lat},${lon}\n`, (err) => {
    if (err) {
      console.log('❌ Error writing to ESP32:', err.message);
      res.json({success: false, error: err.message});
    } else {
      console.log('✅ Location updated to:', lat, lon);
      res.json({success: true});
    }
  });
});

// API endpoint to refresh weather
App.get('/refresh', (req, res) => {
  console.log('🔄 REFRESH REQUEST RECEIVED');
  
  esp32.write('REFRESH\n', (err) => {
    if (err) {
      console.log('❌ Error writing to ESP32:', err.message);
      res.json({success: false, error: err.message});
    } else {
      console.log('✅ Refresh command sent to ESP32');
      res.json({success: true});
    }
  });
});

// Start the server
App.listen(Port, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running at http://localhost:${Port}`);
  console.log('='.repeat(50));
});
