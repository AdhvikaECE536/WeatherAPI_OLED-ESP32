/*
 * WEATHER STATION with Node.js Control
 * ESP32 with OLED Display (128x64)
 * 
 * COMMANDS FROM SERIAL:
 * - CONDITION, TEMP, FEELS, HUMIDITY, PRESSURE, WIND (change view)
 * - AUTO (cycle through all views)
 * - REFRESH (update weather now)
 * - LOC:17.23,78.43 (change location)
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// ================= OLED CONFIG =================
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define OLED_ADDR 0x3C
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// ================= WIFI CONFIG ====================
const char* ssid = "Ad35";
const char* password = "adhvi536*";

// ================= WEATHER API ====================
String URL = "http://api.openweathermap.org/data/2.5/weather?";
String ApiKey = "d3c893bfa03ab05bce6f5df53c1fde83";

String lat = "17.23912677317249";
String lon = "78.43579050289536";

// ================= SCREEN CONTROL =================
uint8_t screenStage = 0;
unsigned long lastUpdate = 0;
bool autoMode = true;
int currentView = 0; // 0=condition, 1=temp, 2=feels, 3=humidity, 4=pressure, 5=wind

// Weather data storage
String weatherDescription = "Loading...";
float temperature = 0;
float feelsLike = 0;
int humidity = 0;
int pressure = 0;
float windSpeed = 0;

void setup() {
  Serial.begin(115200);

  // OLED init
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    Serial.println("OLED not found");
    while (true);
  }

  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(2);

  // Connecting message
  display.setCursor(0, 0);
  display.println("Connect-");
  display.println("ing WiFi");
  display.display();

  // WiFi connect
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWeather Station Ready!");
  Serial.println("Commands: CONDITION, TEMP, FEELS, HUMIDITY, PRESSURE, WIND, AUTO, REFRESH");
  Serial.println("Location: LOC:lat,lon");

  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("WiFi OK!");
  display.display();
  delay(2000);
  
  // Get initial weather
  fetchWeather();
}

void loop() {
  // Check for serial commands
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    handleCommand(command);
  }

  // Auto-update weather every 10 seconds
  if (millis() - lastUpdate > 10000) {
    lastUpdate = millis();
    fetchWeather();
    
    // Auto cycle views if in auto mode
    if (autoMode) {
      currentView = (currentView + 1) % 6;
    }
  }

  // Display current view
  displayWeather();
  delay(100);
}

void handleCommand(String cmd) {
  cmd.toUpperCase();
  
  if (cmd == "CONDITION") {
    autoMode = false;
    currentView = 0;
    Serial.println("View: Condition");
  }
  else if (cmd == "TEMP") {
    autoMode = false;
    currentView = 1;
    Serial.println("View: Temperature");
  }
  else if (cmd == "FEELS") {
    autoMode = false;
    currentView = 2;
    Serial.println("View: Feels Like");
  }
  else if (cmd == "HUMIDITY") {
    autoMode = false;
    currentView = 3;
    Serial.println("View: Humidity");
  }
  else if (cmd == "PRESSURE") {
    autoMode = false;
    currentView = 4;
    Serial.println("View: Pressure");
  }
  else if (cmd == "WIND") {
    autoMode = false;
    currentView = 5;
    Serial.println("View: Wind");
  }
  else if (cmd == "AUTO") {
    autoMode = true;
    Serial.println("Auto mode ON");
  }
  else if (cmd == "REFRESH") {
    Serial.println("Refreshing weather...");
    fetchWeather();
  }
  else if (cmd.startsWith("LOC:")) {
    // Parse location: LOC:17.23,78.43
    String coords = cmd.substring(4);
    int commaPos = coords.indexOf(',');
    if (commaPos > 0) {
      lat = coords.substring(0, commaPos);
      lon = coords.substring(commaPos + 1);
      Serial.print("Location updated: ");
      Serial.print(lat);
      Serial.print(", ");
      Serial.println(lon);
      fetchWeather();
    }
  }
}

void fetchWeather() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected!");
    return;
  }

  HTTPClient http;
  String url = URL + "lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + ApiKey;
  http.begin(url);

  int httpCode = http.GET();

  if (httpCode > 0) {
    String JSON_Data = http.getString();
    
    DynamicJsonDocument doc(2048);
    DeserializationError error = deserializeJson(doc, JSON_Data);
    
    if (!error) {
      weatherDescription = doc["weather"][0]["description"].as<String>();
      temperature = doc["main"]["temp"];
      feelsLike = doc["main"]["feels_like"];
      humidity = doc["main"]["humidity"];
      pressure = doc["main"]["pressure"];
      windSpeed = doc["wind"]["speed"];
      
      Serial.println("Weather updated!");
    }
  } else {
    Serial.println("HTTP request failed");
  }

  http.end();
}

void displayWeather() {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.setTextSize(2);

  switch (currentView) {
    case 0: // Condition
      display.println("Weather:");
      display.setTextSize(1);
      display.println(weatherDescription);
      break;

    case 1: // Temperature
      display.println("Temp:");
      display.print(temperature, 1);
      display.println(" C");
      break;

    case 2: // Feels Like
      display.println("Feels:");
      display.print(feelsLike, 1);
      display.println(" C");
      break;

    case 3: // Humidity
      display.println("Humid:");
      display.print(humidity);
      display.println(" %");
      break;

    case 4: // Pressure
      display.println("Press:");
      display.setTextSize(1);
      display.print(pressure);
      display.println(" hPa");
      break;

    case 5: // Wind
      display.println("Wind:");
      display.print(windSpeed, 1);
      display.println(" m/s");
      break;
  }

  // Show mode indicator
  display.setTextSize(1);
  display.setCursor(0, 56);
  if (autoMode) {
    display.print("AUTO");
  } else {
    display.print("MANUAL");
  }

  display.display();
}
