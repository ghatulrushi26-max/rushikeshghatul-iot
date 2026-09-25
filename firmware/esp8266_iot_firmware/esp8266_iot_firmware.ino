/*
 =====================================================================================
  IoT Project: Smart Environment Monitoring, LCD Display & LED Automation
  Developers: rushikesh&dnyaneshwar
  Institution: Dept. of Electrical Engineering, Gov. Engg. College
  Platform: ESP8266 (NodeMCU / WeMos D1 Mini)
 =====================================================================================
 
  HARDWARE CONNECTIONS:
  -------------------------------------------------------------
  Component          ESP8266 Pin      GPIO Pin      Notes
  -------------------------------------------------------------
  DHT11 Data Pin     D5               GPIO 14       10k Pull-up resistor to 3.3V
  DHT11 VCC          3V3              --            Use 3.3V or 5V (depending on module)
  DHT11 GND          GND              --            Common Ground
  -------------------------------------------------------------
  LED Anode (+)      D7               GPIO 13       Through 220-330 Ohm resistor
  LED Cathode (-)    GND              --            Common Ground
  -------------------------------------------------------------
  LCD 16x2 I2C SCL   D1               GPIO 5        I2C Clock
  LCD 16x2 I2C SDA   D2               GPIO 4        I2C Data
  LCD I2C VCC        VIN / 5V         --            LCDs typically operate on 5V
  LCD I2C GND        GND              --            Common Ground
  -------------------------------------------------------------

  REQUIRED ARDUINO LIBRARIES (Install via Arduino IDE Library Manager):
  1. "DHT sensor library" by Adafruit
  2. "Adafruit Unified Sensor" by Adafruit
  3. "LiquidCrystal_I2C" by Frank de Brabander or Marco Schwartz
  4. "ArduinoJson" by Benoit Blanchon (Version 6 or 7 supported)
  5. ESP8266 Board Package (URL in Arduino Preferences):
     http://arduino.esp8266.com/stable/package_esp8266com_index.json
 =====================================================================================
*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ================= WIFI CONFIGURATION =================
const char* ssid     = "IoT";
const char* password = "12345678";

// ================= BACKEND SERVER CONFIGURATION =================
// Deployed Live Render Application URL:
const char* serverBaseUrl = "https://rushikeshghatul-iot.onrender.com";

// ================= PIN DEFINITIONS =================
#define DHTPIN  14    // D5 is GPIO 14
#define DHTTYPE DHT11 // DHT 11
#define LEDPIN  13    // D7 is GPIO 13

// ================= PERIPHERAL INSTANCES =================
DHT dht(DHTPIN, DHTTYPE);

// Typical I2C address is 0x27. If your screen doesn't show text, change to 0x3F.
LiquidCrystal_I2C lcd(0x27, 16, 2);

// ================= TIMING & CACHE =================
unsigned long lastSensorSendTime = 0;
const unsigned long SENSOR_INTERVAL = 10000; // Send DHT11 data every 10 seconds (10000ms)

String lastLcdLine1 = "";
String lastLcdLine2 = "";
int lastLedState = -1;

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n\n=========================================");
  Serial.println("  rushikesh ghatul IoT System Starting... ");
  Serial.println("=========================================");

  // Initialize LED Pin
  pinMode(LEDPIN, OUTPUT);
  digitalWrite(LEDPIN, LOW);

  // Initialize DHT Sensor
  dht.begin();

  // Initialize I2C LCD on D2 (SDA / GPIO 4) and D1 (SCL / GPIO 5)
  Wire.begin(4, 5);
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("rushikesh ghatul");
  lcd.setCursor(0, 1);
  lcd.print("Connecting WiFi");

  // Connect to WiFi
  connectToWiFi();
}

void loop() {
  // Ensure WiFi remains connected
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }

  unsigned long currentMillis = millis();

  // Every 10 seconds: Read DHT11 and send data to Server
  if (currentMillis - lastSensorSendTime >= SENSOR_INTERVAL) {
    lastSensorSendTime = currentMillis;
    sendSensorData();
    fetchDeviceStatus();
  }

  delay(200);
}

// -------------------------------------------------------------
// WiFi Connection Helper
// -------------------------------------------------------------
void connectToWiFi() {
  Serial.printf("Connecting to SSID: %s\n", ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("WiFi: ");
  lcd.print(ssid);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    lcd.setCursor(attempts % 16, 1);
    lcd.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected Successfully!");
    Serial.print("ESP8266 IP Address: ");
    Serial.println(WiFi.localIP());

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("WiFi Connected!");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP().toString());
    delay(2000);
  } else {
    Serial.println("\nWiFi Connection Failed! Retrying in loop...");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("WiFi Conn Failed");
    lcd.setCursor(0, 1);
    lcd.print("Check SSID/Pass");
  }
}

// -------------------------------------------------------------
// Send DHT11 Sensor Data to Backend
// -------------------------------------------------------------
void sendSensorData() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature(); // Celsius

  // Validate DHT reading
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("❌ Failed to read from DHT11 sensor! Check D5 wiring.");
    return;
  }

  Serial.println("\n--- DHT11 Sensor Reading ---");
  Serial.printf("Temperature: %.1f °C | Humidity: %.1f %%\n", temperature, humidity);

  String url = String(serverBaseUrl) + "/api/sensor-data";
  HTTPClient http;
  http.setTimeout(12000); // 12s timeout for cloud requests

  bool beginSuccess = false;
  std::unique_ptr<BearSSL::WiFiClientSecure> secureClient;
  WiFiClient plainClient;

  if (url.startsWith("https://")) {
    secureClient.reset(new BearSSL::WiFiClientSecure);
    secureClient->setInsecure(); // Disable certificate checks for Render Cloud
    beginSuccess = http.begin(*secureClient, url);
  } else {
    beginSuccess = http.begin(plainClient, url);
  }
  
  if (beginSuccess) {
    http.addHeader("Content-Type", "application/json");

    // Construct JSON Payload
    StaticJsonDocument<128> doc;
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    int httpResponseCode = http.POST(jsonPayload);
    if (httpResponseCode > 0) {
      Serial.printf("✅ Sensor data posted to Render! HTTP Response: %d\n", httpResponseCode);
    } else {
      Serial.printf("❌ Error sending sensor data. Code: %d, Error: %s\n", httpResponseCode, http.errorToString(httpResponseCode).c_str());
    }
    http.end();
  } else {
    Serial.println("❌ Unable to connect to server URL for sensor POST");
  }
}

// -------------------------------------------------------------
// Fetch Device Status (LCD Text & LED Automation)
// -------------------------------------------------------------
void fetchDeviceStatus() {
  String url = String(serverBaseUrl) + "/api/device/status";
  HTTPClient http;
  http.setTimeout(12000); // 12s timeout for cloud requests

  bool beginSuccess = false;
  std::unique_ptr<BearSSL::WiFiClientSecure> secureClient;
  WiFiClient plainClient;

  if (url.startsWith("https://")) {
    secureClient.reset(new BearSSL::WiFiClientSecure);
    secureClient->setInsecure(); // Disable certificate checks for Render Cloud
    beginSuccess = http.begin(*secureClient, url);
  } else {
    beginSuccess = http.begin(plainClient, url);
  }

  if (beginSuccess) {
    int httpResponseCode = http.GET();
    if (httpResponseCode == HTTP_CODE_OK) {
      String response = http.getString();
      Serial.println("📥 Device Status received: " + response);

      StaticJsonDocument<256> doc;
      DeserializationError error = deserializeJson(doc, response);

      if (!error) {
        // 1. Process LED Status
        int ledState = doc["led"] | 0;
        if (ledState != lastLedState) {
          lastLedState = ledState;
          digitalWrite(LEDPIN, ledState == 1 ? HIGH : LOW);
          Serial.printf("💡 LED (D7) updated to: %s\n", ledState == 1 ? "ON (HIGH)" : "OFF (LOW)");
        }

        // 2. Process LCD Lines
        const char* l1 = doc["lcd_line1"] | "";
        const char* l2 = doc["lcd_line2"] | "";
        String line1 = String(l1);
        String line2 = String(l2);

        if (line1 != lastLcdLine1 || line2 != lastLcdLine2) {
          lastLcdLine1 = line1;
          lastLcdLine2 = line2;

          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print(line1.substring(0, 16));
          lcd.setCursor(0, 1);
          lcd.print(line2.substring(0, 16));
          Serial.println("📟 LCD Display updated!");
          Serial.println("   Row 1: [" + line1 + "]");
          Serial.println("   Row 2: [" + line2 + "]");
        }
      } else {
        Serial.print("❌ JSON Parse failed: ");
        Serial.println(error.c_str());
      }
    } else {
      Serial.printf("❌ Error fetching status. HTTP Code: %d\n", httpResponseCode);
    }
    http.end();
  }
}
