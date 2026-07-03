# Weather API OLED ESP32 

The repository contains a simple weather display system using ESP32 microcontroller and OLED screen that fetches real-time weather data from OpenWeatherMap API.




### 📂 Repository Structure

- `1. arduino_code.ino`    – ESP32 code to fetch and display weather on OLED  
- `2. find_port.js`        – Notes for detecting ESP32 serial port  
- `3. server.js`           – Local server 
- `4. index.html`          – Frontend   
- `5. i2c_scanner.ino`     – I2C address scanner for OLED


### ✨ Features

- 🌡️ **Real-Time Weather Data** - Fetches live temperature, humidity, and weather conditions
- 📡 **WiFi Connectivity** - Connects to your home WiFi network
- 🖥️ **OLED Display** - Shows weather information on a 128x64 OLED screen
- 🔄 **Auto-Update** - Refreshes weather data at regular intervals
- ⚡ **Low Power** - Efficient ESP32 implementation


### 🛠️ Hardware Requirements

| Component | Specification | Quantity |
|-----------|--------------|----------|
| ESP32 Development Board | ESP32-WROOM-32 or similar | 1 |
| OLED Display | SSD1306 128x64 (I2C) | 1 |
| USB Cable | Micro USB or USB-C | 1 |
| Breadboard (Optional) | Standard size | 1 |
| Jumper Wires | Male-to-Female | 4 |


### 🔌 Connections

The OLED display is connected to ESP32 through suggested conections:

```
ESP32          OLED SSD1306
─────────────────────────────
3.3V     →     VCC
GND      →     GND
GPIO21   →     SDA
GPIO22   →     SCK
```

## PART A : Using only Arduino IDE

### 📦 Software Requirements

#### Arduino IDE Setup

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


### 🚀 Setup Steps

#### Step 1: Get OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section in 
4. Copy your API key (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

#### Step 2: Get location coordinates

1. Go to [Google Maps](https://www.google.com/maps)
2. Right-click on any location of choice
3. Copy the coordinates information (lat, lon)

#### Step 3: Configure the Code

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

#### Step 4: Upload to ESP32

1. Connect ESP32 to your computer via USB
2. Select board: `Tools` → `Board` → `ESP32 Dev Module`
3. Select correct COM port: `Tools` → `Port` → `COMx` (Windows) or `/dev/ttyUSB0` (Linux/Mac)
4. Click the **Verify** button (✓) 
6. Click the **Upload** button (→)
7. Wait for "Done uploading" message

Note: it is best to sure the code runs with no errors before uploading it to the microcontroller (99% no errors would incur)

#### Step 5: Monitor Serial Output

1. Open Serial Monitor: `Tools` → `Serial Monitor`
2. Set baud rate to `115200` and `new line`
3. You should see connection status and weather data!

### 📊 Display Information

The OLED screen shows:
- 🌍 Condition
- 🌡️ Current temperature (°C)
- 🌡️ What it feels like (°C)
- 💧 Humidity percentage
- ☁️ Weather description
- 🕐 Auto / Manual (It will show manual when we use frontend to select the type of information we intend to view)

### 🎨 Customization

#### Change Temperature Unit
```cpp
// In the code, find this line and change it:
String units = "metric";   // For Celsius
// OR
String units = "imperial"; // For Fahrenheit
```

#### Change Update Interval
```cpp
// Default is 10 minutes (600000 milliseconds)
unsigned long updateInterval = 600000;  // Change this value
```

#### Change the location
In the serial monitor, the coordinates could be typed to change the location
```
LOC:xx.xx,xx.xx
```

### 🐛 Troubleshooting

#### Display Not Working
- Try connecting to 5V rail (common small modules run on 3.3V or 5V logic)
- Use GPIO4 and GPIO15 instead of GPIO21 and GPIO22, respectively (make similar changes in the Arduino_code)
- Verify I2C address is `0x3C` (or try `0x3D`)
- Test with I2C scanner sketch (available in the codes (index:5))


#### WiFi Connection Failed
- Double-check SSID and password (case-sensitive!)
- Make sure WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
- Check if WiFi has special characters in password
- Try moving ESP32 closer to router

#### API Not Responding
- Verify API key is correct
- Check city name spelling
- Ensure you have internet connection
- Wait a few minutes (new API keys can take time to activate)
- Check API usage limits (free tier has limits)

#### Code Won't Upload
- Hold `BOOT` button on ESP32 while uploading
- Check USB cable (some cables are power-only)
- Select correct COM port
- Try a different USB port
- Install CH340/CP2102 drivers if needed

### 📖 How It Works

1. **WiFi Connection**: ESP32 connects to your WiFi network
2. **API Request**: Sends HTTP GET request to OpenWeatherMap API
3. **JSON Parsing**: Receives and parses JSON response
4. **Display Update**: Extracts weather data and updates OLED screen
5. **Loop**: Waits for update interval, then repeats


---

## PART B: Using Node.js (Web Control)

### 🌐 What's Different?

Part B adds **remote control** to your weather station! Instead of just watching the OLED cycle through views automatically, you can now:
- 📍 Change location with one click
- 🔄 Switch between weather views instantly
- 🌍 Use preset cities or custom coordinates

### 📦 Additional Requirements

- **Node.js** (version 14 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js)

### 🔧 Installation

1. **Install Node.js**
- Go to https://nodejs.org
- Download the LTS version (v24.12.0)
- Open Terminal (Mac/Linux) or Command Prompt (Windows)
- Type: node --version (You should see something like v24.12.0)

2. **Install VS Code (Code Editor)**
- Go to https://code.visualstudio.com
- Download and install

3. **Create your first project folder**
- Open Terminal > New Terminal
- On the top right-corner of the terminal window, click on the drop-down beside the `+` icon
- Select Command Prompt (Windows)
- Type
  
  ```bash
  # After " C:\Users\YourName> ", type the following
  mkdir my-project                              # creates folder
  cd my-project                                 # opens the folder

  Now, it should be in the form " C:\Users\YourName\my-project> "

  npm init -y                                   # initialize a Node.js project
  # A package.json file will be created

  npm install @serialport/parser-readline       # to process raw binary data from a serial port
  ```

### 📁 Project Structure for Node.js

```
my-project/
├── server.js                 # Node.js server
├── find_port.js              # Port detection utility
├── public/                   # Web interface folder
│   └── index.html            # Control panel webpage
├── package.json
└── node_modules/
```


### 🚀 Setup Steps

1. **Create `find-port.js`**
   Open the `find-port.js` file in VS code

2. **Plug in your ESP32**
   Connect your ESP32 to your computer via USB cable.

3. **Run the script**
   
   ```bash
   # Run after " C:\Users\YourName\my-project> "

   node find-port.js


   **You should see something like:**
   
   Available ports:
   - COM3
   Manufacturer: Silicon Labs

   Or on Mac/Linux:
   - /dev/ttyUSB0
   ```

4. **Update Server Configuration & Upload `index.html`**

   Open `server.js` and update the COM port (if needed):

   ```js
   const esp32 = new SerialPort({
     path: 'COM8',  // ← Change this to your port
     baudRate: 115200
   });
   ```
   
   Also upload the `index.html` file by creating `public/index.html` (After C:\Users\YourName\my-project> )
   

5. **Upload Updated Arduino Code**
   Upload the `arduino_code.ino` code to ESP32 and close the IDE window

6. **Start the Server**
   
   ```bash
   # Run after " C:\Users\YourName\my-project> "

   node server.js


   **You should see something like:**
   
   ✅ ESP32 Weather Station connected on COM8
   🌐 Weather Control Server running at http://localhost:3000
   Open this URL in your browser!
   ```

7. **Open the Web Interface**

   Open your browser and go to:
   ```
   http://localhost:3000
   ```

#### View Controls
Click any button to change the OLED display:
- **☁️ Condition** - Shows weather description (e.g., "clear sky", "light rain")
- **🌡️ Temperature** - Current temperature
- **🤔 Feels Like** - Apparent temperature
- **💧 Humidity** - Humidity percentage
- **📊 Pressure** - Atmospheric pressure
- **💨 Wind Speed** - Wind speed in m/s
- **🔄 Auto Cycle** - Automatically rotate through all views

#### Location Controls
1. **Manual Entry**: Enter custom latitude and longitude
2. **Preset Cities**: Click quick-access buttons for:
   - 🗽 New York
   - 🇬🇧 London
   - 🗼 Tokyo
   - 🇮🇳 Delhi
   - 🏠 Hyderabad
  
### 🐛 Troubleshooting

#### Server Won't Start
- Make sure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check if port 3000 is already in use
- Verify ESP32 is connected to correct COM port

#### Can't Connect from Browser
- Make sure server is running (`node server.js`)
- Check firewall settings
- Try `http://localhost:3000` first
- Check console for error messages

#### ESP32 Not Responding to Commands
- Verify you uploaded the updated Arduino code with serial command handling
- Check Serial Monitor shows "Weather Station Ready!"
- Make sure baud rate is 115200
- Try unplugging and replugging ESP32

### 📖 How It Works
1. **Serial Communication**: Node.js server connects to ESP32 via USB serial
2. **Web Server**: Express.js serves the HTML interface
3. **User Input**: Web buttons send commands to Node.js server
4. **Command Relay**: Server sends commands to ESP32 over serial
5. **ESP32 Response**: ESP32 processes commands and updates display
6. **Feedback**: Status updates shown in browser

---

## 🎓 Learning Outcomes

By completing this project, you'll learn:
- 📡 WiFi connectivity with ESP32
- 🌐 Making HTTP API requests
- 📊 JSON data parsing
- 🖥️ I2C communication with OLED displays
- 💻 Node.js and Express.js basics
- 🔌 Serial communication between devices
- 🎨 HTML/CSS/JavaScript web development
- 🤖 IoT device control and monitoring

---

## 🚀 Future Enhancements

- 🔔 Push notifications for weather alerts
- 📈 Historical weather data graphs
- 🌙 Day/night themes based on sunrise/sunset
- 🗣️ Voice control integration
- 📱 Mobile app development
- ☁️ Cloud data logging
- 🤖 Integration with home automation systems
- 🎨 Custom weather icons on OLED

---
## Photos

<img width="767" height="432" alt="image" src="https://github.com/user-attachments/assets/46a7b7e2-8c16-4423-8e49-e2be7e1b0eb5" />

<img width="767" height="601" alt="image" src="https://github.com/user-attachments/assets/5647e743-1ccc-4da2-b843-21daefcf7f85" />

---

## 📄 License

This project is open source and available for educational purposes. 

---

## 👤 Author

[@AdhvikaECE536](https://github.com/AdhvikaECE536)

---

## 🙏 Acknowledgments
Special thanks to GMR Airports Ltd for proving me the environment to learn, explore and grow. 

---

**Note**: This is a learning project. It uses open-source libraries and public APIs. Feel free to experiment and modify the code!


---

Made with ❤️ using ESP32
