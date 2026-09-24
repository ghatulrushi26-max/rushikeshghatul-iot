# rushikesh ghatul - Smart IoT Cloud Platform

![Tech Stack](https://img.shields.io/badge/Stack-NodeJS%20%7C%20Express%20%7C%20SQLite%20%7C%20TailwindCSS-orange)
![Hardware](https://img.shields.io/badge/Hardware-ESP8266%20%7C%20DHT11%20%7C%20LCD1602%20I2C%20%7C%20LED-blue)
![Platform](https://img.shields.io/badge/Deploy-Render%20Cloud-success)

> **Designed and Developed by rushikesh&dnyaneshwar**  
> *Dept. of Electrical Engineering, Gov. Engg. College*

---

## 🌟 Project Overview

**rushikesh ghatul** is a comprehensive, production-ready Internet of Things (IoT) ecosystem featuring:
- **Cloud Backend**: Node.js & Express with persistent SQLite database storage.
- **Modern Orange Theme Web UI**: Built with Tailwind CSS, Chart.js, and font icons (no image dependencies).
- **Tab 1: Environment Monitoring**:
  - Live DHT11 sensor readings updated every 10 seconds.
  - **Innovative Radial Gauges & Dynamic Seek Bars** for Temperature and Humidity.
  - Interactive multi-axis atmospheric trend graphs.
  - **Saved Records History Table** with pagination (20 records/page, latest records first, delete action, formatted in `+5:30 Asia/Kolkata` IST timezone).
- **Tab 2: Smart 16x2 LCD**:
  - Live virtual 16x2 dot-matrix LCD preview screen.
  - Remote row-by-row text update (Row 1 & Row 2 inputs, max 16 chars) with quick message presets.
- **Tab 3: LED Automation**:
  - Interactive hardware toggle switch with glowing visual lamp feedback controlling ESP8266 pin `D7`.
- **Hardware Integration**: Complete ESP8266 Arduino C++ firmware supporting DHT11, I2C LCD (16x2), and LED.
- **Render Ready**: Optimized for zero-hassle deployment on Render.com free tier.

---

## 🔌 Hardware Setup & Pin Connections

| Component | ESP8266 Pin | GPIO Pin | Details |
|---|---|---|---|
| **DHT11 Sensor (Data)** | **D5** | GPIO 14 | 10kΩ pull-up resistor to 3.3V |
| **DHT11 Sensor (VCC)** | **3V3** | -- | 3.3V DC Power |
| **DHT11 Sensor (GND)** | **GND** | -- | Common Ground |
| **LED Anode (+)** | **D7** | GPIO 13 | Connect via 220Ω - 330Ω resistor |
| **LED Cathode (-)** | **GND** | -- | Common Ground |
| **LCD 16x2 I2C (SCL)** | **D1** | GPIO 5 | I2C Clock Line |
| **LCD 16x2 I2C (SDA)** | **D2** | GPIO 4 | I2C Data Line |
| **LCD 16x2 I2C (VCC)** | **VIN / 5V** | -- | 5V Power for standard LCD backlight |
| **LCD 16x2 I2C (GND)** | **GND** | -- | Common Ground |

---

## 📡 Arduino ESP8266 Firmware Setup

The complete firmware code is located in [`firmware/esp8266_iot_firmware.ino`](file:///c:/Users/GCOEY/Desktop/iotproject/firmware/esp8266_iot_firmware.ino).

### 1. Required Arduino Libraries
Open **Arduino IDE** > **Sketch** > **Include Library** > **Manage Libraries...** and install:
1. `DHT sensor library` by Adafruit
2. `Adafruit Unified Sensor` by Adafruit
3. `LiquidCrystal_I2C` by Frank de Brabander or Marco Schwartz
4. `ArduinoJson` by Benoit Blanchon (v6 or v7)

### 2. Configure WiFi and Server URL
Open `firmware/esp8266_iot_firmware.ino` and verify:
```cpp
const char* ssid     = "IoT";
const char* password = "12345678";

// For Render deployment:
const char* serverBaseUrl = "https://your-app-name.onrender.com";

// For local testing (use your computer's local Wi-Fi IP):
// const char* serverBaseUrl = "http://192.168.1.100:3000";
```

### 3. Upload Code
1. Connect your ESP8266 (NodeMCU) via micro-USB.
2. Select **Tools** > **Board** > **ESP8266 Boards** > **NodeMCU 1.0 (ESP-12E Module)**.
3. Select the correct **COM Port**.
4. Click **Upload**.
5. Open Serial Monitor at **115200 baud** to view real-time diagnostics.

---

## 🚀 How to Run Locally

Node.js v20 is installed on your system!

1. Open your terminal in this directory:
   ```powershell
   cd c:\Users\GCOEY\Desktop\iotproject
   ```
2. Start the server:
   ```powershell
   npm start
   ```
3. Open your browser and navigate to:
   - **Login / Register**: [http://localhost:3000/login.html](http://localhost:3000/login.html)
   - **Dashboard**: [http://localhost:3000/index.html](http://localhost:3000/index.html)

*(A default admin account is pre-registered: `rushikesh@example.com` / `password123`, or click Register to create a new one!)*

---

## ☁️ Deploying to Render (Step-by-Step)

This repository is ready to deploy directly to [Render](https://render.com).

### Step 1: Push Project to GitHub
1. Initialize git and commit:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit of Rushikeshghatul IoT platform"
   ```
2. Create a new repository on GitHub (e.g. `rushikeshghatul-iot`).
3. Push to GitHub:
   ```powershell
   git remote add origin https://github.com/<YOUR_USERNAME>/rushikeshghatul-iot.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Create Web Service on Render
1. Go to [dashboard.render.com](https://dashboard.render.com/) and click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Name**: `rushikeshghatul-iot`
   - **Runtime**: `Node`
   - **Region**: Singapore or closest to India for minimal latency
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
4. In **Environment Variables**:
   - `PORT`: `10000` (Render sets this automatically)
   - `JWT_SECRET`: `your_secure_secret_key`
5. Click **Create Web Service**.
6. Render will build and deploy the app in under 2 minutes! You will receive a public HTTPS URL:
   `https://rushikeshghatul-iot.onrender.com`

### Step 3: Connect ESP8266 to Cloud
Replace `serverBaseUrl` in `esp8266_iot_firmware.ino` with your Render URL (`https://rushikeshghatul-iot.onrender.com`) and re-flash the ESP8266.

---

## 🛠️ API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | `POST` | Registers new user `{ name, email, password }` |
| `/api/auth/login` | `POST` | Authenticates user `{ email, password }` |
| `/api/sensor-data` | `POST` | Records DHT11 data `{ temperature, humidity }` |
| `/api/sensor-data/latest`| `GET` | Fetches most recent sensor reading |
| `/api/sensor-data/history`| `GET` | Paginated records with IST timestamps (`?page=1&limit=20`) |
| `/api/sensor-data/:id` | `DELETE`| Deletes record by ID |
| `/api/sensor-data/chart` | `GET` | Returns last 25 readings for Chart.js |
| `/api/sensor-data/simulate`| `POST` | Generates simulated DHT11 reading for testing |
| `/api/device/status` | `GET` | Consolidated ESP8266 polling endpoint `{ led, lcd_line1, lcd_line2 }` |
| `/api/device/lcd` | `POST` | Updates LCD text `{ line1, line2 }` |
| `/api/device/led` | `POST` | Updates LED state `{ state: 0 or 1 }` |
| `/api/device/settings` | `GET` | Returns current LCD and LED configurations |

---

## 📜 Footer Notice
```
Designed and Developed by rushikesh&dnyaneshwar, Dept. of Electrical Engineering, Gov. Engg............
```
