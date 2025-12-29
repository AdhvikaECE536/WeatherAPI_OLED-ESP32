// including the express library & creating the web server "App"
const Express = require('express');
const App = Express();

const ServerPort = 3000;

// connecting to ESP32
const {SerialPort} = require('serialport');

const esp32 = new SerialPort({
  path : 'COM8',
  baudRate : 115200  
});

esp32.on('open', () => {
  console.log('esp32 connected');
});

// to get full-line data
const {ReadlineParser} = require('@serialport/parser-readline');
const Parser = esp32.pipe(new ReadlineParser({delimiter: '\n'}));

Parser.on('data',(data) => {
  console.log('Weather station:', data);
});

// serve static files from the public folder & json files
App.use(Express.static('public'));
App.use(Express.json());

// API endpoint to change location
App.post('/location', (req, res) => {
  const { lat, lon } = req.body;
  
  if (!lat || !lon) {
    return res.json({ success: false, error: 'Missing lat or lon' });
  }
  
  const command = `LOC:${lat},${lon}\n`;
  
  esp32.write(command, (err) => {
    if (err) {
      res.json({ success: false, error: err.message });
    } else {
      console.log('📍 Sent location:', lat, lon);
      res.json({ success: true, lat, lon });
    }
  });
});

// API endpoint to change screen view
App.get('/screen/:view', (req, res) => {
  const view = req.params.view.toUpperCase();
  const validViews = ['CONDITION', 'TEMP', 'FEELS', 'HUMIDITY', 'PRESSURE', 'WIND', 'AUTO'];
  
  if (!validViews.includes(view)) {
    return res.json({ success: false, error: 'Invalid view' });
  }
  
  esp32.write(view + '\n', (err) => {
    if (err) {
      res.json({ success: false, error: err.message });
    } else {
      console.log('📺 Changed view to:', view);
      res.json({ success: true, view });
    }
  });
});

// API endpoint to refresh weather data
App.get('/refresh', (req, res) => {
  esp32.write('REFRESH\n', (err) => {
    if (err) {
      res.json({ success: false, error: err.message });
    } else {
      console.log('🔄 Refresh weather data');
      res.json({ success: true });
    }
  });
});

// Start server
App.listen(ServerPort, () => {
  console.log('🌐 Weather Control Server running at http://localhost:3000');
  console.log('Open this URL in your browser!');
});
