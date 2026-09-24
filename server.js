const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'rushikeshghatul_iot_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data folder exists for SQLite
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database Connection
const dbPath = path.join(dataDir, 'iot.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initDatabase();
  }
});

// Initialize Tables
function initDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sensor readings table
    db.run(`
      CREATE TABLE IF NOT EXISTS sensor_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temperature REAL NOT NULL,
        humidity REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Device controls table (LCD & LED states)
    db.run(`
      CREATE TABLE IF NOT EXISTS device_settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, () => {
      // Seed default settings if not exists
      const defaultSettings = [
        ['lcd_line1', 'IoT Ready'],
        ['lcd_line2', 'rushikesh ghatul'],
        ['led_state', '0']
      ];

      const stmt = db.prepare(`
        INSERT OR IGNORE INTO device_settings (key, value, updated_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `);
      defaultSettings.forEach(s => stmt.run(s[0], s[1]));
      stmt.finalize();

      // Seed initial sample sensor data if empty
      db.get('SELECT COUNT(*) as count FROM sensor_data', (err, row) => {
        if (!err && row && row.count === 0) {
          const sampleStmt = db.prepare('INSERT INTO sensor_data (temperature, humidity, created_at) VALUES (?, ?, ?)');
          sampleStmt.run(27.4, 62.0, new Date(Date.now() - 12 * 60000).toISOString());
          sampleStmt.run(27.8, 61.5, new Date(Date.now() - 9 * 60000).toISOString());
          sampleStmt.run(28.1, 60.2, new Date(Date.now() - 6 * 60000).toISOString());
          sampleStmt.run(28.5, 59.8, new Date(Date.now() - 3 * 60000).toISOString());
          sampleStmt.run(28.3, 60.4, new Date().toISOString());
          sampleStmt.finalize();
          console.log('Seeded initial sensor readings with ISO timestamps.');
        }
      });
    });
  });
}

// Helpers
function formatIndianDateTime(dateStr) {
  if (!dateStr) {
    return { date: '--', time: '--', iso: null };
  }
  let str = String(dateStr).trim();
  // SQLite CURRENT_TIMESTAMP is 'YYYY-MM-DD HH:MM:SS'
  if (!str.includes('T')) {
    str = str.replace(' ', 'T');
  }
  if (!str.endsWith('Z') && !str.includes('+')) {
    str = str + 'Z';
  }
  const d = new Date(str);
  const validDate = isNaN(d.getTime()) ? new Date() : d;
  
  const optionsDate = {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };
  const optionsTime = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  return {
    date: validDate.toLocaleDateString('en-IN', optionsDate),
    time: validDate.toLocaleTimeString('en-IN', optionsTime),
    iso: validDate.toISOString()
  };
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// ================= AUTH ROUTES =================

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  db.get('SELECT id FROM users WHERE email = ?', [normalizedEmail], async (err, existing) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (existing) return res.status(409).json({ error: 'Email is already registered' });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name.trim(), normalizedEmail, hashedPassword],
        function (insertErr) {
          if (insertErr) return res.status(500).json({ error: 'Failed to create user' });

          const token = jwt.sign(
            { id: this.lastID, email: normalizedEmail, name: name.trim() },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          res.status(201).json({
            message: 'Registration successful',
            token,
            user: { id: this.lastID, name: name.trim(), email: normalizedEmail }
          });
        }
      );
    } catch (hashErr) {
      res.status(500).json({ error: 'Encryption failure' });
    }
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  db.get('SELECT * FROM users WHERE email = ?', [normalizedEmail], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  });
});

// Get Current Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  });
});

// ================= HARDWARE & SENSOR DATA ROUTES =================

// Post Sensor Data (Used by ESP8266 or Simulation)
app.post('/api/sensor-data', (req, res) => {
  const { temperature, humidity } = req.body;

  if (temperature === undefined || humidity === undefined) {
    return res.status(400).json({ error: 'temperature and humidity are required' });
  }

  const tempVal = parseFloat(temperature);
  const humVal = parseFloat(humidity);

  if (isNaN(tempVal) || isNaN(humVal)) {
    return res.status(400).json({ error: 'Invalid numeric sensor values' });
  }

  db.run(
    'INSERT INTO sensor_data (temperature, humidity, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
    [tempVal, humVal],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to record sensor data' });
      res.status(201).json({
        success: true,
        id: this.lastID,
        temperature: tempVal,
        humidity: humVal,
        message: 'Sensor data recorded successfully'
      });
    }
  );
});

// Latest Sensor Data
app.get('/api/sensor-data/latest', (req, res) => {
  db.get('SELECT * FROM sensor_data ORDER BY id DESC LIMIT 1', (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) {
      return res.json({
        id: 0,
        temperature: 0,
        humidity: 0,
        time: '--',
        date: '--',
        raw_created_at: null
      });
    }

    const { date, time } = formatIndianDateTime(row.created_at);
    res.json({
      id: row.id,
      temperature: row.temperature,
      humidity: row.humidity,
      date,
      time,
      raw_created_at: row.created_at
    });
  });
});

// Sensor Data History with Pagination (20 records per page, latest first)
app.get('/api/sensor-data/history', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  db.get('SELECT COUNT(*) as total FROM sensor_data', (err, countRow) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    const total = countRow ? countRow.total : 0;
    const totalPages = Math.ceil(total / limit) || 1;

    db.all(
      'SELECT * FROM sensor_data ORDER BY id DESC LIMIT ? OFFSET ?',
      [limit, offset],
      (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        const records = (rows || []).map((row, idx) => {
          const { date, time } = formatIndianDateTime(row.created_at);
          return {
            row_index: total - offset - idx, // Logical serial number
            id: row.id,
            temperature: Number(row.temperature).toFixed(1),
            humidity: Number(row.humidity).toFixed(1),
            date,
            time,
            created_at: row.created_at
          };
        });

        res.json({
          records,
          pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        });
      }
    );
  });
});

// Delete Record
app.delete('/api/sensor-data/:id', (req, res) => {
  const recordId = parseInt(req.params.id);
  if (!recordId) return res.status(400).json({ error: 'Valid record ID required' });

  db.run('DELETE FROM sensor_data WHERE id = ?', [recordId], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to delete record' });
    if (this.changes === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ success: true, message: `Record #${recordId} deleted successfully` });
  });
});

// Chart History Data (Chronological order)
app.get('/api/sensor-data/chart', (req, res) => {
  const limit = Math.min(60, parseInt(req.query.limit) || 25);
  db.all(
    'SELECT * FROM (SELECT * FROM sensor_data ORDER BY id DESC LIMIT ?) ORDER BY id ASC',
    [limit],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      const chartData = (rows || []).map(r => {
        const { time } = formatIndianDateTime(r.created_at);
        return {
          id: r.id,
          temperature: r.temperature,
          humidity: r.humidity,
          time
        };
      });
      res.json(chartData);
    }
  );
});

// ================= DEVICE CONTROLS (ESP8266 + DASHBOARD) =================

// Single consolidated endpoint for ESP8266 device polling
app.get('/api/device/status', (req, res) => {
  db.all('SELECT key, value FROM device_settings', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    const settings = {};
    rows.forEach(r => {
      settings[r.key] = r.value;
    });

    res.json({
      led: settings.led_state === '1' ? 1 : 0,
      lcd_line1: (settings.lcd_line1 || '').padEnd(16, ' ').slice(0, 16),
      lcd_line2: (settings.lcd_line2 || '').padEnd(16, ' ').slice(0, 16)
    });
  });
});

// Dashboard: Get device settings
app.get('/api/device/settings', (req, res) => {
  db.all('SELECT key, value, updated_at FROM device_settings', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    const settings = {
      lcd_line1: 'IoT Ready',
      lcd_line2: 'rushikesh ghatul',
      led_state: '0'
    };
    rows.forEach(r => {
      settings[r.key] = r.value;
    });

    res.json({
      lcd_line1: settings.lcd_line1,
      lcd_line2: settings.lcd_line2,
      led_state: settings.led_state === '1' ? 1 : 0
    });
  });
});

// Dashboard: Update LCD text
app.post('/api/device/lcd', (req, res) => {
  let { line1, line2 } = req.body;
  line1 = (line1 !== undefined ? String(line1) : '').slice(0, 16);
  line2 = (line2 !== undefined ? String(line2) : '').slice(0, 16);

  db.serialize(() => {
    const stmt = db.prepare(`
      INSERT INTO device_settings (key, value, updated_at) 
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP
    `);
    stmt.run('lcd_line1', line1);
    stmt.run('lcd_line2', line2);
    stmt.finalize((err) => {
      if (err) return res.status(500).json({ error: 'Failed to update LCD display settings' });
      res.json({
        success: true,
        message: 'LCD display updated successfully',
        line1,
        line2
      });
    });
  });
});

// Dashboard: Update LED state
app.post('/api/device/led', (req, res) => {
  const { state } = req.body;
  const stateVal = (state === 1 || state === '1' || state === true) ? '1' : '0';

  db.run(`
    INSERT INTO device_settings (key, value, updated_at) 
    VALUES ('led_state', ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP
  `, [stateVal], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to toggle LED state' });
    res.json({
      success: true,
      led_state: stateVal === '1' ? 1 : 0,
      message: `LED turned ${stateVal === '1' ? 'ON' : 'OFF'}`
    });
  });
});

// Simulation helper endpoint
app.post('/api/sensor-data/simulate', (req, res) => {
  const baseTemp = 27 + (Math.random() * 5); // 27 to 32 C
  const baseHum = 55 + (Math.random() * 15); // 55% to 70%
  const tempVal = parseFloat(baseTemp.toFixed(1));
  const humVal = parseFloat(baseHum.toFixed(1));

  db.run(
    'INSERT INTO sensor_data (temperature, humidity, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
    [tempVal, humVal],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to simulate sensor data' });
      res.json({
        success: true,
        id: this.lastID,
        temperature: tempVal,
        humidity: humVal,
        message: 'Simulated DHT11 reading recorded!'
      });
    }
  );
});

// Fallback to index.html for SPA-like feel
app.get('*', (req, res) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 rushikesh ghatul IoT Server running on port ${PORT}`);
  console.log(`📡 Local URL: http://localhost:${PORT}`);
  console.log(`⚙️  Render Environment: ${process.env.RENDER ? 'Yes' : 'Local'}`);
  console.log(`====================================================`);
});
