// ==========================================================================
// Rushikeshghatul IoT Dashboard Logic
// ==========================================================================

// Global state
let currentTab = 'tab-env';
let pollCountdown = 10;
let pollTimerInterval = null;
let currentHistoryPage = 1;
let chartInstance = null;
let minTempRecorded = 999;
let maxTempRecorded = -999;

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  initUserInfo();
  initTabs();
  initLcdControls();
  initLedControls();
  initChart();

  // Load initial data
  loadLatestSensorData();
  loadHistory(1);
  loadDeviceSettings();

  // Start 10-second polling
  startSensorPolling();
});

// -------------------------------------------------------------
// 1. User & Auth UI
// -------------------------------------------------------------
function initUserInfo() {
  const user = getUser();
  const userNameEl = document.getElementById('userNameDisplay');
  const userAvatarEl = document.getElementById('userAvatarInitial');
  
  if (user && userNameEl) {
    userNameEl.textContent = user.name || user.email;
    if (userAvatarEl && user.name) {
      userAvatarEl.textContent = user.name.charAt(0).toUpperCase();
    }
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to sign out?')) {
        logout();
      }
    });
  }
}

// -------------------------------------------------------------
// 2. Tab Navigation
// -------------------------------------------------------------
function initTabs() {
  const tabs = [
    { id: 'tabBtnEnv', target: 'tab-env' },
    { id: 'tabBtnLcd', target: 'tab-lcd' },
    { id: 'tabBtnLed', target: 'tab-led' }
  ];

  tabs.forEach(tab => {
    const btn = document.getElementById(tab.id);
    if (!btn) return;

    btn.addEventListener('click', () => {
      // Deactivate all
      tabs.forEach(t => {
        const otherBtn = document.getElementById(t.id);
        const section = document.getElementById(t.target);
        if (otherBtn) {
          otherBtn.className = "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-gray-400 hover:text-white hover:bg-slate-800/60 transition";
        }
        if (section) section.classList.add('hidden');
      });

      // Activate clicked
      btn.className = "flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 transition";
      const targetSec = document.getElementById(tab.target);
      if (targetSec) targetSec.classList.remove('hidden');

      currentTab = tab.target;

      // Refresh content if switching to tab
      if (tab.target === 'tab-env') {
        loadLatestSensorData();
        loadHistory(currentHistoryPage);
        if (chartInstance) chartInstance.resize();
      } else if (tab.target === 'tab-lcd' || tab.target === 'tab-led') {
        loadDeviceSettings();
      }
    });
  });
}

// -------------------------------------------------------------
// 3. Tab 1: Environment Monitoring (DHT11 every 10 seconds)
// -------------------------------------------------------------
function startSensorPolling() {
  const countdownEl = document.getElementById('pollCountdownTimer');
  
  // Interval for 1-second countdown display
  if (pollTimerInterval) clearInterval(pollTimerInterval);

  pollTimerInterval = setInterval(() => {
    pollCountdown--;
    if (countdownEl) {
      countdownEl.textContent = `${pollCountdown}s`;
    }

    if (pollCountdown <= 0) {
      pollCountdown = 10;
      loadLatestSensorData();
      loadHistory(currentHistoryPage, false);
      loadChartData();
    }
  }, 1000);

  // Quick refresh button
  const manualRefreshBtn = document.getElementById('manualRefreshBtn');
  if (manualRefreshBtn) {
    manualRefreshBtn.addEventListener('click', () => {
      pollCountdown = 10;
      loadLatestSensorData();
      loadHistory(currentHistoryPage);
      loadChartData();
      showToast('Data refreshed!', 'info');
    });
  }

  // Quick Simulate reading button (for testing before ESP8266 is turned on)
  const simulateBtn = document.getElementById('simulateDataBtn');
  if (simulateBtn) {
    simulateBtn.addEventListener('click', async () => {
      simulateBtn.disabled = true;
      try {
        const res = await fetch('/api/sensor-data/simulate', { method: 'POST' });
        if (res.ok) {
          showToast('Simulated DHT11 reading recorded!', 'success');
          pollCountdown = 10;
          loadLatestSensorData();
          loadHistory(1);
          loadChartData();
        }
      } catch (err) {
        showToast('Failed to simulate sensor data', 'error');
      } finally {
        simulateBtn.disabled = false;
      }
    });
  }
}

// Load Latest Sensor Data & Update Gauges & Seek Bars
async function loadLatestSensorData() {
  try {
    const res = await fetch('/api/sensor-data/latest');
    if (!res.ok) throw new Error('Failed to fetch sensor reading');
    const data = await res.json();

    const temp = parseFloat(data.temperature) || 0;
    const hum = parseFloat(data.humidity) || 0;

    // Update statistics
    if (temp > 0) {
      if (temp < minTempRecorded) minTempRecorded = temp;
      if (temp > maxTempRecorded) maxTempRecorded = temp;
    }

    // 1. Update Temperature Displays
    const tempValueEl = document.getElementById('tempValueDisplay');
    const tempFahrEl = document.getElementById('tempFahrDisplay');
    const tempMinMaxEl = document.getElementById('tempMinMaxDisplay');
    const tempStatusEl = document.getElementById('tempStatusBadge');
    const lastUpdateEl = document.getElementById('sensorLastUpdateTime');

    if (tempValueEl) tempValueEl.textContent = temp.toFixed(1);
    if (tempFahrEl) tempFahrEl.textContent = `${((temp * 9/5) + 32).toFixed(1)}°F`;
    if (tempMinMaxEl && minTempRecorded !== 999) {
      tempMinMaxEl.textContent = `Min: ${minTempRecorded.toFixed(1)}°C | Max: ${maxTempRecorded.toFixed(1)}°C`;
    }

    if (tempStatusEl) {
      if (temp < 18) {
        tempStatusEl.textContent = 'Cool / Cold';
        tempStatusEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20';
      } else if (temp <= 30) {
        tempStatusEl.textContent = 'Optimal Comfort';
        tempStatusEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      } else if (temp <= 38) {
        tempStatusEl.textContent = 'Warm Ambient';
        tempStatusEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20';
      } else {
        tempStatusEl.textContent = 'High Heat Warning';
        tempStatusEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20';
      }
    }

    // 2. Update Humidity Displays
    const humValueEl = document.getElementById('humValueDisplay');
    const humStatusEl = document.getElementById('humStatusBadge');
    if (humValueEl) humValueEl.textContent = hum.toFixed(1);

    if (humStatusEl) {
      if (hum < 30) {
        humStatusEl.textContent = 'Dry Air';
        humStatusEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20';
      } else if (hum <= 65) {
        humStatusEl.textContent = 'Comfortable (Ideal)';
        humStatusEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      } else {
        humStatusEl.textContent = 'High Moisture';
        humStatusEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
      }
    }

    if (lastUpdateEl && data.time) {
      lastUpdateEl.textContent = `${data.time}, ${data.date} (IST +5:30)`;
    }

    // 3. Update INNOVATIVE SEEK BARS
    // Temperature: Range 0 to 50°C
    const tempPercent = Math.min(100, Math.max(0, (temp / 50) * 100));
    const tempSeekBarFill = document.getElementById('tempSeekBarFill');
    if (tempSeekBarFill) {
      tempSeekBarFill.style.width = `${tempPercent}%`;
    }

    // Humidity: Range 0 to 100%
    const humPercent = Math.min(100, Math.max(0, hum));
    const humSeekBarFill = document.getElementById('humSeekBarFill');
    if (humSeekBarFill) {
      humSeekBarFill.style.width = `${humPercent}%`;
    }

    // 4. Update INNOVATIVE RADIAL GAUGES (SVG circumference = 2 * PI * r)
    // For r=58, circumference ≈ 364.4. Semi-gauge uses dashoffset.
    const tempGaugeCircle = document.getElementById('tempGaugeCircle');
    if (tempGaugeCircle) {
      const radius = 58;
      const circumference = 2 * Math.PI * radius;
      // Semi-circle active stroke (max 50°C)
      const offset = circumference - (tempPercent / 100) * (circumference * 0.75);
      tempGaugeCircle.style.strokeDashoffset = offset;
    }

    const humGaugeCircle = document.getElementById('humGaugeCircle');
    if (humGaugeCircle) {
      const radius = 58;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (humPercent / 100) * (circumference * 0.75);
      humGaugeCircle.style.strokeDashoffset = offset;
    }

  } catch (err) {
    console.error('Sensor reading fetch error:', err);
  }
}

// -------------------------------------------------------------
// History Table with Pagination (20 per page, latest first)
// -------------------------------------------------------------
async function loadHistory(page = 1, showSpinner = true) {
  currentHistoryPage = page;
  const tbody = document.getElementById('historyTableBody');
  const paginationInfo = document.getElementById('paginationInfo');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');

  if (showSpinner && tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-8 text-gray-400">
          <i class="fa-solid fa-spinner fa-spin text-orange-500 text-xl mr-2"></i> Loading records...
        </td>
      </tr>
    `;
  }

  try {
    const res = await fetch(`/api/sensor-data/history?page=${page}&limit=20`);
    if (!res.ok) throw new Error('Failed to load history');
    const result = await res.json();

    const records = result.records || [];
    const p = result.pagination;

    if (records.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-10 text-gray-500">
            <i class="fa-solid fa-cloud-arrow-down text-3xl mb-2 block opacity-40"></i>
            No sensor records found in database yet.
          </td>
        </tr>
      `;
      if (paginationInfo) paginationInfo.textContent = 'Showing 0 records';
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    tbody.innerHTML = '';
    records.forEach((row) => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-800 hover:bg-slate-800/40 transition duration-150';
      tr.innerHTML = `
        <td class="px-5 py-3.5 text-xs font-mono text-gray-400">#${row.row_index || row.id}</td>
        <td class="px-5 py-3.5 font-semibold text-orange-400">
          <span class="inline-flex items-center gap-1.5">
            <i class="fa-solid fa-temperature-half text-orange-500/70 text-xs"></i>
            ${row.temperature} °C
          </span>
        </td>
        <td class="px-5 py-3.5 font-semibold text-cyan-400">
          <span class="inline-flex items-center gap-1.5">
            <i class="fa-solid fa-droplet text-cyan-500/70 text-xs"></i>
            ${row.humidity} %
          </span>
        </td>
        <td class="px-5 py-3.5 text-xs text-gray-300 font-mono">
          <i class="fa-regular fa-clock text-gray-500 mr-1"></i> ${row.time}
        </td>
        <td class="px-5 py-3.5 text-xs text-gray-300">
          <i class="fa-regular fa-calendar text-gray-500 mr-1"></i> ${row.date}
        </td>
        <td class="px-5 py-3.5 text-center">
          <button 
            onclick="deleteRecord(${row.id})"
            class="px-2.5 py-1 text-xs font-medium rounded-lg text-red-400 hover:text-white hover:bg-red-500/80 border border-red-500/20 transition-all duration-200"
            title="Delete this reading"
          >
            <i class="fa-solid fa-trash-can mr-1"></i> Delete
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Update pagination controls
    if (paginationInfo) {
      const startRecord = (p.page - 1) * p.limit + 1;
      const endRecord = Math.min(p.page * p.limit, p.total);
      paginationInfo.textContent = `Showing ${startRecord}-${endRecord} of ${p.total} records (Page ${p.page} of ${p.totalPages})`;
    }

    if (prevBtn) {
      prevBtn.disabled = !p.hasPrev;
      prevBtn.onclick = () => loadHistory(p.page - 1);
    }
    if (nextBtn) {
      nextBtn.disabled = !p.hasNext;
      nextBtn.onclick = () => loadHistory(p.page + 1);
    }

  } catch (err) {
    console.error('History load error:', err);
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-6 text-red-400">
          <i class="fa-solid fa-triangle-exclamation mr-2"></i> Failed to load sensor history records.
        </td>
      </tr>
    `;
  }
}

// Delete Record Action
window.deleteRecord = async function(id) {
  if (!confirm(`Are you sure you want to delete sensor record #${id}?`)) return;

  try {
    const res = await fetch(`/api/sensor-data/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok) {
      showToast(data.message || `Record #${id} deleted`, 'success');
      loadHistory(currentHistoryPage, false);
      loadLatestSensorData();
      loadChartData();
    } else {
      showToast(data.error || 'Failed to delete record', 'error');
    }
  } catch (err) {
    showToast('Network error while deleting', 'error');
  }
};

// -------------------------------------------------------------
// Live Chart (Chart.js)
// -------------------------------------------------------------
function initChart() {
  const ctx = document.getElementById('sensorTrendChart');
  if (!ctx) return;

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Temperature (°C)',
          data: [],
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.12)',
          borderWidth: 2.5,
          tension: 0.35,
          fill: true,
          pointBackgroundColor: '#f97316',
          pointRadius: 3,
          pointHoverRadius: 6,
          yAxisID: 'y'
        },
        {
          label: 'Humidity (%)',
          data: [],
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.08)',
          borderWidth: 2.5,
          tension: 0.35,
          fill: true,
          pointBackgroundColor: '#06b6d4',
          pointRadius: 3,
          pointHoverRadius: 6,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          labels: {
            color: '#94a3b8',
            font: { family: 'Plus Jakarta Sans', size: 12 }
          }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#f97316',
          bodyColor: '#f8fafc',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#64748b', font: { size: 10 } }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: { display: true, text: 'Temperature (°C)', color: '#f97316', font: { size: 11 } },
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#f97316' },
          min: 0,
          max: 55
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: { display: true, text: 'Humidity (%)', color: '#06b6d4', font: { size: 11 } },
          grid: { drawOnChartArea: false },
          ticks: { color: '#06b6d4' },
          min: 0,
          max: 100
        }
      }
    }
  });

  loadChartData();
}

async function loadChartData() {
  if (!chartInstance) return;
  try {
    const res = await fetch('/api/sensor-data/chart?limit=25');
    if (!res.ok) return;
    const data = await res.json();

    const labels = data.map(d => d.time || '');
    const temps = data.map(d => d.temperature);
    const hums = data.map(d => d.humidity);

    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = temps;
    chartInstance.data.datasets[1].data = hums;
    chartInstance.update('none'); // smooth update without full reload
  } catch (err) {
    console.error('Error loading chart data:', err);
  }
}

// -------------------------------------------------------------
// 4. Tab 2: Smart LCD Display Controls
// -------------------------------------------------------------
function initLcdControls() {
  const row1Input = document.getElementById('lcdRow1Input');
  const row2Input = document.getElementById('lcdRow2Input');
  const count1 = document.getElementById('row1CharCount');
  const count2 = document.getElementById('row2CharCount');
  const updateBtn = document.getElementById('updateLcdBtn');

  const previewLine1 = document.getElementById('lcdPreviewLine1');
  const previewLine2 = document.getElementById('lcdPreviewLine2');

  function updatePreview() {
    if (previewLine1 && row1Input) {
      previewLine1.textContent = (row1Input.value || '').padEnd(16, ' ').slice(0, 16);
    }
    if (previewLine2 && row2Input) {
      previewLine2.textContent = (row2Input.value || '').padEnd(16, ' ').slice(0, 16);
    }
    if (count1 && row1Input) count1.textContent = `${row1Input.value.length}/16`;
    if (count2 && row2Input) count2.textContent = `${row2Input.value.length}/16`;
  }

  if (row1Input) row1Input.addEventListener('input', updatePreview);
  if (row2Input) row2Input.addEventListener('input', updatePreview);

  if (updateBtn) {
    updateBtn.addEventListener('click', async () => {
      const line1 = row1Input.value.slice(0, 16);
      const line2 = row2Input.value.slice(0, 16);

      updateBtn.disabled = true;
      updateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Sending to ESP8266...';

      try {
        const res = await fetch('/api/device/lcd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ line1, line2 })
        });
        const data = await res.json();

        if (res.ok) {
          showToast('LCD Display successfully updated!', 'success');
          updatePreview();
        } else {
          showToast(data.error || 'Failed to update LCD', 'error');
        }
      } catch (err) {
        showToast('Network error while updating LCD', 'error');
      } finally {
        updateBtn.disabled = false;
        updateBtn.innerHTML = '<i class="fa-solid fa-paper-plane mr-2"></i> Update Physical LCD';
      }
    });
  }

  // Preset Buttons
  const presets = document.querySelectorAll('.lcd-preset-btn');
  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      const l1 = btn.getAttribute('data-line1') || '';
      const l2 = btn.getAttribute('data-line2') || '';
      if (row1Input) row1Input.value = l1;
      if (row2Input) row2Input.value = l2;
      updatePreview();
    });
  });
}

// -------------------------------------------------------------
// 5. Tab 3: LED Automation (D7 Pin)
// -------------------------------------------------------------
function initLedControls() {
  const ledToggle = document.getElementById('ledToggleSwitch');
  const ledBulb = document.getElementById('ledBulbGraphic');
  const ledStatusBadge = document.getElementById('ledStatusBadge');
  const ledStatusText = document.getElementById('ledStatusDescription');

  if (!ledToggle) return;

  ledToggle.addEventListener('change', async () => {
    const isChecked = ledToggle.checked;
    await updateLedState(isChecked ? 1 : 0);
  });
}

async function updateLedState(state) {
  const ledToggle = document.getElementById('ledToggleSwitch');
  const ledBulb = document.getElementById('ledBulbGraphic');
  const ledStatusBadge = document.getElementById('ledStatusBadge');
  const ledStatusText = document.getElementById('ledStatusDescription');

  try {
    const res = await fetch('/api/device/led', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state })
    });
    const data = await res.json();

    if (res.ok) {
      applyLedUiState(state === 1);
      showToast(`LED (D7) is now ${state === 1 ? 'TURNED ON' : 'TURNED OFF'}`, 'success');
    } else {
      showToast(data.error || 'Failed to toggle LED', 'error');
      if (ledToggle) ledToggle.checked = !state;
    }
  } catch (err) {
    showToast('Network error toggling LED', 'error');
    if (ledToggle) ledToggle.checked = !state;
  }
}

function applyLedUiState(isOn) {
  const ledToggle = document.getElementById('ledToggleSwitch');
  const ledBulb = document.getElementById('ledBulbGraphic');
  const ledStatusBadge = document.getElementById('ledStatusBadge');
  const ledStatusText = document.getElementById('ledStatusDescription');

  if (ledToggle) ledToggle.checked = isOn;

  if (ledBulb) {
    if (isOn) {
      ledBulb.className = 'led-bulb led-on';
      ledBulb.innerHTML = '<i class="fa-solid fa-lightbulb text-4xl text-white"></i>';
    } else {
      ledBulb.className = 'led-bulb led-off';
      ledBulb.innerHTML = '<i class="fa-regular fa-lightbulb text-4xl text-slate-500"></i>';
    }
  }

  if (ledStatusBadge) {
    if (isOn) {
      ledStatusBadge.textContent = 'ACTIVE (HIGH)';
      ledStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-sm shadow-orange-500/30';
    } else {
      ledStatusBadge.textContent = 'INACTIVE (LOW)';
      ledStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-gray-400 border border-slate-700';
    }
  }

  if (ledStatusText) {
    ledStatusText.textContent = isOn 
      ? 'LED on Pin D7 is currently glowing at 3.3V logic level.' 
      : 'LED on Pin D7 is currently OFF (0V logic level).';
  }
}

// -------------------------------------------------------------
// Load Device Settings from Server (Sync LCD & LED states)
// -------------------------------------------------------------
async function loadDeviceSettings() {
  try {
    const res = await fetch('/api/device/settings');
    if (!res.ok) return;
    const settings = await res.json();

    // Sync LCD
    const row1Input = document.getElementById('lcdRow1Input');
    const row2Input = document.getElementById('lcdRow2Input');
    const previewLine1 = document.getElementById('lcdPreviewLine1');
    const previewLine2 = document.getElementById('lcdPreviewLine2');

    if (row1Input && !row1Input.matches(':focus')) {
      row1Input.value = settings.lcd_line1 || '';
    }
    if (row2Input && !row2Input.matches(':focus')) {
      row2Input.value = settings.lcd_line2 || '';
    }
    if (previewLine1) {
      previewLine1.textContent = (settings.lcd_line1 || 'IoT Ready').padEnd(16, ' ').slice(0, 16);
    }
    if (previewLine2) {
      previewLine2.textContent = (settings.lcd_line2 || 'rushikesh ghatul').padEnd(16, ' ').slice(0, 16);
    }

    // Sync LED
    applyLedUiState(settings.led_state === 1);

  } catch (err) {
    console.error('Failed to sync device settings:', err);
  }
}

// -------------------------------------------------------------
// Toast Notification Utility
// -------------------------------------------------------------
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'success' 
    ? 'bg-slate-900 border-emerald-500/40 text-emerald-400' 
    : type === 'error'
    ? 'bg-slate-900 border-red-500/40 text-red-400'
    : 'bg-slate-900 border-orange-500/40 text-orange-400';

  const icon = type === 'success'
    ? 'fa-circle-check text-emerald-400'
    : type === 'error'
    ? 'fa-triangle-exclamation text-red-400'
    : 'fa-circle-info text-orange-400';

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium transition-all duration-300 transform translate-y-2 opacity-0 ${bg}`;
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span class="text-white">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}
