# Rushikesh D. Ghatul — Electrical Engineering Portfolio

A modern, responsive, and recruiter-focused personal portfolio website for **Rushikesh D. Ghatul**, an Electrical Engineering student at **Government College of Engineering, Yavatmal**.

Built specifically for high-speed static hosting on **GitHub Pages** using clean, semantic **HTML5**, modern **Vanilla CSS**, and lightweight **Vanilla JavaScript**.

---

## ⚡ Live Features

* **Recruiter-Focused Layout:** Direct access to Resume, Academic Timeline, Internships, Technical Skills, and Contact Form.

* **Dynamic Certificate Gallery (`js/certificates.js`):** Add unlimited certificates (PDF or images) by simply editing a data file without touching HTML.

  * 8+ Filter Categories: *Internship, Achievement, Workshop, Course, Training, Participation, Industrial Visit, Other*.
  * Integrated Lightbox & PDF Viewer with direct Download buttons.

* **Dynamic Projects Portfolio (`js/projects.js`):** Filter by *Renewable Energy, Power Systems, Industrial Automation, and Academic Projects*. Displays "Coming Soon" badges gracefully for missing URLs.

* **Interactive Resume Section:** Ready-to-view and download PDF resume at:
  `assets/Rushikesh_D_Ghatul_Resume.pdf`

* **Engineering Visual Theme:** Dark mode by default with electric cyan and amber accents, plus a 1-click Light Mode toggle.

* **100% Mobile & Desktop Responsive:** Optimized hamburger menu, fluid typography, and touch-friendly controls.

* **Zero-Dependency Architecture:** Immediate local preview (`file:///`) and instant deployment to GitHub Pages without complex build steps or failing CI pipelines.

---

## 📁 Portfolio Project Directory Structure

```text
rushikesh/

├── index.html
├── assets/
│   ├── images/
│   │   ├── profile-rushikesh.svg
│   │   └── favicon.svg
│   ├── certificates/
│   │   ├── msedcl-internship-sample.pdf
│   │   ├── plc-scada-sample.pdf
│   │   ├── solar-pv-sample.pdf
│   │   ├── industrial-visit-cstps.pdf
│   │   └── sample-certificate.pdf
│   ├── achievements/
│   ├── internships/
│   ├── projects/
│   ├── industrial-visits/
│   └── Rushikesh_D_Ghatul_Resume.pdf
├── css/
│   └── style.css
├── js/
│   ├── certificates.js
│   ├── projects.js
│   └── main.js
├── .gitignore
└── README.md
```

---

# 🚀 GitHub Pages Deployment

Follow these steps to publish the portfolio online for free with a permanent:

```text
https://your-username.github.io/portfolio/
```

### Step 1: Create a GitHub Repository

1. Log in to GitHub.
2. Click the **+** icon in the top-right corner and choose **New repository**.
3. Name your repository:

   * For a custom portfolio URL: `portfolio`
   * Or name it exactly `<username>.github.io` for your GitHub root site.
4. Keep the repository **Public**.
5. Do **not** initialize it with a README.
6. Click **Create repository**.

### Step 2: Upload Your Project

Open PowerShell inside:

```text
C:\Users\bhagw\OneDrive\Desktop\rushikesh
```

Run:

```bash
git init
git add .
git commit -m "Initial commit: Rushikesh D. Ghatul professional portfolio"
git branch -M main
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```

Alternatively, files can be uploaded directly through GitHub's web interface.

### Step 3: Enable GitHub Pages

1. Open your repository on GitHub.
2. Click **Settings**.
3. Select **Pages** from the left sidebar.
4. Under **Build and deployment**:

   * **Source:** Deploy from a branch
   * **Branch:** `main`
   * **Folder:** `/ (root)`
5. Click **Save**.

### Step 4: Access Your Live Website

Wait approximately 1–2 minutes for deployment.

Your website will be available at:

```text
https://<username>.github.io/<repo-name>/
```

Share the link on your LinkedIn profile, resume, and job applications.

---

# 📜 Managing Certificates

You can add **unlimited certificates** without writing HTML.

### 1. Add the Certificate File

Place your certificate (`.pdf`, `.jpg`, `.jpeg`, `.png`, or `.webp`) inside:

```text
assets/certificates/my-new-certificate.pdf
```

### 2. Add an Entry to `js/certificates.js`

Add an object to the `certificatesData` list:

```javascript
{
  id: "solar-energy-course-2026",
  title: "Advanced Solar PV Design Certificate",
  organization: "National Institute of Solar Energy",
  date: "October 2026",
  category: "Course",
  file: "assets/certificates/my-new-certificate.pdf",
  image: "assets/certificates/my-new-certificate-thumbnail.jpg",
  description: "Hands-on design of on-grid solar photovoltaic systems and string sizing."
}
```

Available categories:

```text
Internship
Achievement
Workshop
Course
Training
Participation
Industrial Visit
Other
```

Save the file, commit, and push it to GitHub.

The certificate will automatically appear in the gallery with category filtering, image lightbox/PDF preview, and download buttons.

---

# 📄 Updating Your Resume

### 1. Name Your Resume

```text
Rushikesh_D_Ghatul_Resume.pdf
```

### 2. Copy It Into

```text
assets/Rushikesh_D_Ghatul_Resume.pdf
```

Replace the existing placeholder if required.

### 3. Commit and Push

```bash
git add assets/Rushikesh_D_Ghatul_Resume.pdf
git commit -m "Update official resume PDF"
git push
```

The **View Resume** and **Download Resume** buttons will point to the updated document.

---

# 🛠️ Customizing Personal Details

### Profile Picture

Replace:

```text
assets/images/profile-rushikesh.svg
```

with your formal portrait and update the image `src` in `index.html`.

### Social Media Links

Search for:

```text
https://linkedin.com/in/your-profile
https://github.com/your-username
```

and replace them with your actual profile links.

### Contact Details

Update your:

* Phone number
* Email address
* College CGPA

where the `[ADD ...]` placeholders are present in `index.html`.

### Projects

Open:

```text
js/projects.js
```

to modify:

* Project descriptions
* Technologies
* GitHub repository URLs
* Live project URLs

---

# 🌟 Portfolio Technologies

* **HTML5:** Semantic architecture using `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>`.
* **CSS3:** Custom properties, Flexbox, CSS Grid, glassmorphism, responsive media queries, and dark/light themes.
* **JavaScript (ES6):** Dynamic rendering, filtering, scrollspy, modal viewer, and theme persistence using `localStorage`.
* **Font Awesome 6:** Engineering, utility, and social media vector icons.
* **Google Fonts:** Outfit, Inter, and JetBrains Mono.

---

# 📬 Portfolio Contact

**Rushikesh D. Ghatul**

*Electrical Engineering Student | Aspiring Electrical Engineer*

Government College of Engineering, Yavatmal

Maharashtra, India

Email: `rushikesh.ghatul@example.com`

---

# 🌐 Smart IoT Cloud Platform

## rushikesh ghatul — Smart IoT Cloud Platform

![Tech Stack](https://img.shields.io/badge/Stack-NodeJS%20%7C%20Express%20%7C%20SQLite%20%7C%20TailwindCSS-orange)

![Hardware](https://img.shields.io/badge/Hardware-ESP8266%20%7C%20DHT11%20%7C%20LCD1602%20I2C%20%7C%20LED-blue)

![Platform](https://img.shields.io/badge/Deploy-Render%20Cloud-success)

> **Designed and Developed by Rushikesh & Dnyaneshwar**
>
> *Department of Electrical Engineering, Government Engineering College*

---

## 🌟 Project Overview

**Rushikesh Ghatul Smart IoT Cloud Platform** is a comprehensive Internet of Things ecosystem featuring:

* **Cloud Backend:** Node.js & Express with persistent SQLite database storage.

* **Modern Orange Theme Web UI:** Built with Tailwind CSS, Chart.js, and font icons.

* **Environment Monitoring:**

  * Live DHT11 sensor readings updated every 10 seconds.
  * Radial gauges and dynamic seek bars for temperature and humidity.
  * Interactive multi-axis atmospheric trend graphs.
  * Saved records history table with pagination.
  * Latest records displayed first.
  * Delete functionality.
  * IST timezone support (`+5:30 Asia/Kolkata`).

* **Smart 16×2 LCD:**

  * Live virtual 16×2 dot-matrix LCD preview.
  * Remote row-by-row text updates.
  * Row 1 and Row 2 inputs with a maximum of 16 characters.
  * Quick message presets.

* **LED Automation:**

  * Interactive hardware toggle switch.
  * Visual lamp feedback.
  * Controls ESP8266 pin `D7`.

* **Hardware Integration:** ESP8266 Arduino C++ firmware supporting DHT11, I2C LCD (16×2), and LED.

* **Render Ready:** Optimized for deployment on the Render Cloud platform.

---

# 🔌 Hardware Setup & Pin Connections

| Component               | ESP8266 Pin  | GPIO Pin | Details                             |
| ----------------------- | ------------ | -------- | ----------------------------------- |
| **DHT11 Sensor (Data)** | **D5**       | GPIO 14  | 10kΩ pull-up resistor to 3.3V       |
| **DHT11 Sensor (VCC)**  | **3V3**      | —        | 3.3V DC Power                       |
| **DHT11 Sensor (GND)**  | **GND**      | —        | Common Ground                       |
| **LED Anode (+)**       | **D7**       | GPIO 13  | Connect via 220Ω–330Ω resistor      |
| **LED Cathode (-)**     | **GND**      | —        | Common Ground                       |
| **LCD 16×2 I2C (SCL)**  | **D1**       | GPIO 5   | I2C Clock Line                      |
| **LCD 16×2 I2C (SDA)**  | **D2**       | GPIO 4   | I2C Data Line                       |
| **LCD 16×2 I2C (VCC)**  | **VIN / 5V** | —        | 5V power for standard LCD backlight |
| **LCD 16×2 I2C (GND)**  | **GND**      | —        | Common Ground                       |

---

# 📡 ESP8266 Arduino Firmware Setup

The firmware is located at:

```text
firmware/esp8266_iot_firmware.ino
```

## Required Arduino Libraries

Install the following libraries from:

**Arduino IDE → Sketch → Include Library → Manage Libraries**

1. `DHT sensor library` by Adafruit
2. `Adafruit Unified Sensor`
3. `LiquidCrystal_I2C` by Frank de Brabander or Marco Schwartz
4. `ArduinoJson` by Benoit Blanchon

## Wi-Fi and Server Configuration

Open:

```text
firmware/esp8266_iot_firmware.ino
```

Configure your own Wi-Fi credentials:

```cpp
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// For Render deployment:
const char* serverBaseUrl = "https://your-app-name.onrender.com";

// For local testing:
// const char* serverBaseUrl = "http://192.168.1.100:3000";
```

**Do not commit real Wi-Fi passwords or other secrets to GitHub.**

## Upload Firmware

1. Connect the ESP8266/NodeMCU through micro-USB.
2. Select:
   **Tools → Board → ESP8266 Boards → NodeMCU 1.0 (ESP-12E Module)**
3. Select the correct COM port.
4. Click **Upload**.
5. Open Serial Monitor at **115200 baud** for diagnostics.

---

# 💻 How to Run Locally

Node.js v20 is required.

Open PowerShell in your project directory:

```powershell
cd C:\Users\GCOEY\Desktop\iotproject
```

Install dependencies:

```powershell
npm install
```

Start the server:

```powershell
npm start
```

Open:

```text
http://localhost:3000
```

### Login / Register

```text
http://localhost:3000/login.html
```

### Dashboard

```text
http://localhost:3000/index.html
```

Create your own account through the registration page.

---

# ☁️ Deploying to Render

This repository is designed for deployment on **Render**.

## Step 1: Push Project to GitHub

```powershell
git add .
git commit -m "Initial commit of Rushikesh IoT platform"
git branch -M main
git push -u origin main
```

## Step 2: Create a Web Service

1. Open the Render dashboard.
2. Select **New + → Web Service**.
3. Connect your GitHub repository.
4. Configure:

| Setting       | Value                                 |
| ------------- | ------------------------------------- |
| Name          | `rushikeshghatul-iot`                 |
| Runtime       | `Node`                                |
| Region        | Singapore or closest available region |
| Branch        | `main`                                |
| Build Command | `npm install`                         |
| Start Command | `node server.js`                      |
| Instance Type | `Free`                                |

## Environment Variables

Add:

```text
PORT=10000
JWT_SECRET=your_secure_secret_key
```

Render provides the public HTTPS URL after deployment.

Example:

```text
https://rushikeshghatul-iot.onrender.com
```

## Step 3: Connect ESP8266 to Cloud

Update:

```cpp
const char* serverBaseUrl =
    "https://rushikeshghatul-iot.onrender.com";
```

Then re-flash the ESP8266 firmware.

---

# 🛠️ API Reference

| Endpoint                    | Method   | Description                                      |
| --------------------------- | -------- | ------------------------------------------------ |
| `/api/auth/register`        | `POST`   | Registers a new user `{ name, email, password }` |
| `/api/auth/login`           | `POST`   | Authenticates user `{ email, password }`         |
| `/api/sensor-data`          | `POST`   | Records DHT11 data `{ temperature, humidity }`   |
| `/api/sensor-data/latest`   | `GET`    | Fetches the most recent sensor reading           |
| `/api/sensor-data/history`  | `GET`    | Paginated records with IST timestamps            |
| `/api/sensor-data/:id`      | `DELETE` | Deletes a record by ID                           |
| `/api/sensor-data/chart`    | `GET`    | Returns the last 25 readings for Chart.js        |
| `/api/sensor-data/simulate` | `POST`   | Generates a simulated DHT11 reading for testing  |
| `/api/device/status`        | `GET`    | Returns `{ led, lcd_line1, lcd_line2 }`          |
| `/api/device/lcd`           | `POST`   | Updates LCD text `{ line1, line2 }`              |
| `/api/device/led`           | `POST`   | Updates LED state `{ state: 0 or 1 }`            |
| `/api/device/settings`      | `GET`    | Returns current LCD and LED configurations       |

---

# 📜 Footer Notice

```text
Designed and Developed by Rushikesh & Dnyaneshwar
Department of Electrical Engineering
Government Engineering College
Maharashtra, India
```
Email: [rushikesh.ghatul@example.com](mailto:rushikesh.ghatul@example.com)
=======
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
>>>>>>> 9d88162baef32cb53fb8703d6927da174bbe8e07
