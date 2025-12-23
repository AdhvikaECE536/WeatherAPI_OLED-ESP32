const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const PORT = 3000;

// Connect to ESP32 (change COM8 to your port if needed)
const esp32 = new SerialPort({
  path: 'COM8',
  baudRate: 115200
});

const parser = esp32.pipe(new ReadlineParser({ delimiter: '\n' }));

esp32.on('open', () => {
  console.log('✅ ESP32 Weather Station connected on COM8');
});

parser.on('data', (data) => {
  console.log('🌤️ Weather Station:', data);
});

// Serve static files from 'public' folder
app.use(express.static('public'));
app.use(express.json());

// API endpoint to change location
app.post('/location', (req, res) => {
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
app.get('/screen/:view', (req, res) => {
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
app.get('/refresh', (req, res) => {
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
app.listen(PORT, () => {
  console.log('🌐 Weather Control Server running at http://localhost:3000');
  console.log('Open this URL in your browser!');
});
