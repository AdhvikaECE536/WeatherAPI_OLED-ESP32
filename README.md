# Weather API OLED ESP32 

The repository contains a simple weather display system using ESP32 microcontroller and OLED screen that fetches real-time weather data from OpenWeatherMap API.


## 📂 Repository Structure

- `1. arduino_code.ino` – ESP32 code to fetch and display weather on OLED  
- `2. find_port.js`        – Notes for detecting ESP32 serial port  
- `3. server.js`           – Local server 
- `4. index.html`          – Frontend   
- `5. i2c_scanner.ino`     – I2C address scanner for OLED


## ✨ Features

- 🌡️ **Real-Time Weather Data** - Fetches live temperature, humidity, and weather conditions
- 📡 **WiFi Connectivity** - Connects to your home WiFi network
- 🖥️ **OLED Display** - Shows weather information on a 128x64 OLED screen
- 🔄 **Auto-Update** - Refreshes weather data at regular intervals
- ⚡ **Low Power** - Efficient ESP32 implementation


## 🛠️ Hardware Requirements

| Component | Specification | Quantity |
|-----------|--------------|----------|
| ESP32 Development Board | ESP32-WROOM-32 or similar | 1 |
| OLED Display | SSD1306 128x64 (I2C) | 1 |
| USB Cable | Micro USB or USB-C | 1 |
| Breadboard (Optional) | Standard size | 1 |
| Jumper Wires | Male-to-Female | 4 |


## 🔌 Connections

The OLED display is connected to ESP32 through suggested conections:

```
ESP32          OLED SSD1306
─────────────────────────────
3.3V     →     VCC
GND      →     GND
GPIO21   →     SDA
GPIO22   →     SCK
```


## 📦 Software Requirements

### Arduino IDE Setup

1. **Install Arduino IDE**
   - Download from [arduino.cc](https://www.arduino.cc/en/software)
   - Install version 2.0 or higher

2. **Add ESP32 Board Support**
   - Open Arduino IDE
   - Go to `File` → `Preferences`
   - Add this URL to "Additional Board Manager URLs":
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to `Tools` → `Board` → `Boards Manager`
   - Search for "ESP32" and install "esp32 by Espressif Systems"

3. **Install Required Libraries**
   
   Go to `Sketch` → `Include Library` → `Manage Libraries` and install:
   
   - **Adafruit SSD1306** (by Adafruit)
   - **Adafruit GFX Library** (by Adafruit)
   - **WiFi** (usually pre-installed with ESP32)
   - **HTTPClient** (usually pre-installed with ESP32)
   - **ArduinoJson** (by Benoit Blanchon) - for parsing weather data


## 🚀 Quick Start Guide

### Step 1: Get OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section in 
4. Copy your API key (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 2: Get location coordinates

1. Go to [Google Maps](https://www.google.com/maps)
2. Right-click on any location of choice
3. Copy the coordinates information (lat, lon)

### Step 3: Configure the Code

1. Clone or download this repository
2. Open the `arduino_code.ino` file in Arduino IDE
3. Update these lines with your information:

```cpp
// WiFi Credentials
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// OpenWeatherMap API
String apiKey = "YOUR_API_KEY_HERE";

// Coordinates 
String lat = "<your lat>";
String lon = "<your lon>";
```

### Step 3: Upload to ESP32

1. Connect ESP32 to your computer via USB
2. Select board: `Tools` → `Board` → `ESP32 Dev Module`
3. Select correct COM port: `Tools` → `Port` → `COMx` (Windows) or `/dev/ttyUSB0` (Linux/Mac)
4. Click the **Verify** button (✓) 
6. Click the **Upload** button (→)
7. Wait for "Done uploading" message

Note: it is best to sure the code runs with no errors before uploading it to the microcontroller (99% no errors would incur)

### Step 4: Monitor Serial Output

1. Open Serial Monitor: `Tools` → `Serial Monitor`
2. Set baud rate to `115200` and `new line`
3. You should see connection status and weather data!

## 📊 Display Information

The OLED screen shows:
- 🌍 Condition
- 🌡️ Current temperature (°C)
- 🌡️ What it feels like (°C)
- 💧 Humidity percentage
- ☁️ Weather description
- 🕐 Auto / Manual (It will show manual when we use frontend to select the type of information we intend to view)

## 🎨 Customization

### Change Temperature Unit
```cpp
// In the code, find this line and change it:
String units = "metric";   // For Celsius
// OR
String units = "imperial"; // For Fahrenheit
```

### Change Update Interval
```cpp
// Default is 10 minutes (600000 milliseconds)
unsigned long updateInterval = 600000;  // Change this value
```

### Change the location
In the serial monitor, the coordinates could be typed to change the location
```
LOC:xx.xx,xx.xx
```

## 🐛 Troubleshooting

### Display Not Working
- Try connecting to 5V rail (common small modules run on 3.3V or 5V logic)
- Use GPIO4 and GPIO15 instead of GPIO21 and GPIO22, respectively (make similar changes in the Arduino_code)
- Verify I2C address is `0x3C` (or try `0x3D`)
- Test with I2C scanner sketch (available in the codes (index:5))


### WiFi Connection Failed
- ✅ Double-check SSID and password (case-sensitive!)
- ✅ Make sure WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
- ✅ Check if WiFi has special characters in password
- ✅ Try moving ESP32 closer to router

### API Not Responding
- ✅ Verify API key is correct
- ✅ Check city name spelling
- ✅ Ensure you have internet connection
- ✅ Wait a few minutes (new API keys can take time to activate)
- ✅ Check API usage limits (free tier has limits)

### Code Won't Upload
- ✅ Hold `BOOT` button on ESP32 while uploading
- ✅ Check USB cable (some cables are power-only)
- ✅ Select correct COM port
- ✅ Try a different USB port
- ✅ Install CH340/CP2102 drivers if needed

## 📖 How It Works

1. **WiFi Connection**: ESP32 connects to your WiFi network
2. **API Request**: Sends HTTP GET request to OpenWeatherMap API
3. **JSON Parsing**: Receives and parses JSON response
4. **Display Update**: Extracts weather data and updates OLED screen
5. **Loop**: Waits for update interval, then repeats







## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Your Name** - [@AdhvikaECE536](https://github.com/AdhvikaECE536)

---

**Note**: This is a learning project. It uses open-source libraries and public APIs. Feel free to experiment and modify the code!


---

Made with ❤️ using ESP32
