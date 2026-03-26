// Medication Tracking View Component
export function renderMedicationView() {
  return `
    <div class="view medication-view">
      <div class="view-header">
        <h2>Medication Tracker</h2>
        <p class="view-subtitle">Stay on top of your medication schedule</p>
      </div>

      <div class="medication-content">
        <div class="medication-overview">
          <div class="overview-card">
            <h3>Today's Schedule</h3>
            <div class="today-medications" id="todayMedications">
              <!-- Today's medications will be populated here -->
            </div>
          </div>

          <div class="overview-card">
            <h3>Quick Actions</h3>
            <div class="quick-actions">
              <button class="action-btn" onclick="addMedication()">
                <span class="action-icon">➕</span>
                <span>Add Medication</span>
              </button>
              <button class="action-btn" onclick="viewHistory()">
                <span class="action-icon">📊</span>
                <span>View History</span>
              </button>
              <button class="action-btn" onclick="setReminders()">
                <span class="action-icon">⏰</span>
                <span>Set Reminders</span>
              </button>
            </div>
          </div>
        </div>

        <div class="medication-list">
          <h3>All Medications</h3>
          <div class="medication-items" id="medicationList">
            <!-- Medication list will be populated here -->
          </div>
        </div>

        <div class="medication-adherence">
          <div class="adherence-chart">
            <h3>7-Day Adherence</h3>
            <div class="adherence-bars" id="adherenceChart">
              <!-- Adherence chart will be populated here -->
            </div>
          </div>

          <div class="adherence-stats">
            <div class="stat-item">
              <span class="stat-label">This Week</span>
              <span class="stat-value" id="weeklyAdherence">0%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Streak</span>
              <span class="stat-value" id="adherenceStreak">0 days</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Best Week</span>
              <span class="stat-value" id="bestWeek">0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize medication view
export function initMedicationView() {
  // Load medication data
  loadMedicationData();

  // Set up periodic refresh
  window.medicationRefreshInterval = setInterval(() => {
    if (document.querySelector('.medication-view')) {
      loadMedicationData();
    }
  }, 60000); // Refresh every minute
}

// Load medication data and update UI
function loadMedicationData() {
  const medications = getStoredJSON('fbMedications', []);
  const history = getStoredJSON('fbMedicationHistory', []);

  // Update today's schedule
  updateTodaySchedule(medications, history);

  // Update medication list
  updateMedicationList(medications);

  // Update adherence chart
  updateAdherenceChart(history);
}

// Update today's medication schedule
function updateTodaySchedule(medications, history) {
  const container = document.getElementById('todayMedications');
  if (!container) return;

  const today = new Date().toISOString().slice(0, 10);
  const todayHistory = history.filter(h => h.date === today);

  const todayMeds = medications.map(med => {
    const taken = todayHistory.some(h => h.medicationId === med.id && h.taken);
    const scheduledTime = med.schedule?.[new Date().getDay()] || med.defaultTime;

    return {
      ...med,
      taken,
      scheduledTime,
      nextDose: calculateNextDose(med, todayHistory)
    };
  }).filter(med => med.nextDose);

  if (todayMeds.length === 0) {
    container.innerHTML = '<p class="no-medications">No medications scheduled for today</p>';
    return;
  }

  container.innerHTML = todayMeds.map(med => `
    <div class="medication-schedule-item ${med.taken ? 'taken' : ''}">
      <div class="med-item-info">
        <div class="med-name">${med.name}</div>
        <div class="med-time">${formatTimeFromString(med.scheduledTime)}</div>
        <div class="med-dosage">${med.dosage}</div>
      </div>
      <div class="med-actions">
        ${med.taken ?
          '<span class="taken-indicator">✓ Taken</span>' :
          `<button class="take-med-btn" onclick="takeMedication('${med.id}')">Take Now</button>`
        }
      </div>
    </div>
  `).join('');
}

// Calculate next dose time
function calculateNextDose(medication, todayHistory) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // Check if already taken today
  const takenToday = todayHistory.some(h => h.medicationId === medication.id && h.taken);
  if (takenToday) return null;

  // Get scheduled time for today
  const scheduledTime = medication.schedule?.[now.getDay()] || medication.defaultTime;
  if (!scheduledTime) return null;

  const [hours, minutes] = scheduledTime.split(':').map(Number);
  const scheduledMinutes = hours * 60 + minutes;

  // If scheduled time hasn't passed yet, return it
  if (scheduledMinutes > currentTime) {
    return scheduledTime;
  }

  // If it's past scheduled time, check frequency
  if (medication.frequency === 'as-needed') {
    return null; // No next dose
  }

  // For regular medications, calculate next dose based on frequency
  const hoursSinceScheduled = (currentTime - scheduledMinutes) / 60;
  const dosesPerDay = medication.frequency === 'daily' ? 1 :
                     medication.frequency === 'twice-daily' ? 2 :
                     medication.frequency === 'three-times-daily' ? 3 : 1;

  const hoursBetweenDoses = 24 / dosesPerDay;

  if (hoursSinceScheduled < hoursBetweenDoses) {
    return null; // Already taken or not due yet
  }

  // Calculate next dose time
  const nextDoseMinutes = scheduledMinutes + Math.ceil(hoursSinceScheduled / hoursBetweenDoses) * hoursBetweenDoses * 60;
  const nextDoseTime = new Date(now);
  nextDoseTime.setHours(Math.floor(nextDoseMinutes / 60), nextDoseMinutes % 60, 0, 0);

  return nextDoseTime.toTimeString().slice(0, 5);
}

// Format time string for display
function formatTimeFromString(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour12 = hours % 12 || 12;
  const ampm = hours < 12 ? 'AM' : 'PM';
  return `${hour12}:${minutes} ${ampm}`;
}

// Mark medication as taken
function takeMedication(medicationId) {
  const today = new Date().toISOString().slice(0, 10);
  const history = getStoredJSON('fbMedicationHistory', []);

  // Check if already taken today
  const existingEntry = history.find(h => h.date === today && h.medicationId === medicationId);
  if (existingEntry) {
    showToast('Medication already marked as taken today', 'warning');
    return;
  }

  // Add to history
  const entry = {
    id: crypto.randomUUID(),
    medicationId,
    date: today,
    time: new Date().toTimeString().slice(0, 5),
    taken: true,
    timestamp: new Date().toISOString()
  };

  history.push(entry);
  setStoredJSON('fbMedicationHistory', history);

  // Log event
  logEvent('medication_taken', 'tracker', 0, { medicationId });

  // Update UI
  loadMedicationData();

  showToast('Medication marked as taken', 'success');
}

// Update medication list
function updateMedicationList(medications) {
  const container = document.getElementById('medicationList');
  if (!container) return;

  if (medications.length === 0) {
    container.innerHTML = '<p class="no-medications">No medications added yet. Tap "Add Medication" to get started.</p>';
    return;
  }

  container.innerHTML = medications.map(med => `
    <div class="medication-item">
      <div class="med-info">
        <div class="med-name">${med.name}</div>
        <div class="med-details">
          <span class="med-dosage">${med.dosage}</span>
          <span class="med-frequency">${formatFrequency(med.frequency)}</span>
        </div>
        <div class="med-purpose">${med.purpose || 'No purpose specified'}</div>
      </div>
      <div class="med-actions">
        <button class="edit-med-btn" onclick="editMedication('${med.id}')">Edit</button>
        <button class="delete-med-btn" onclick="deleteMedication('${med.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Format frequency for display
function formatFrequency(frequency) {
  const formats = {
    'daily': 'Once daily',
    'twice-daily': 'Twice daily',
    'three-times-daily': 'Three times daily',
    'as-needed': 'As needed',
    'weekly': 'Weekly'
  };
  return formats[frequency] || frequency;
}

// Update adherence chart
function updateAdherenceChart(history) {
  const container = document.getElementById('adherenceChart');
  if (!container) return;

  // Get last 7 days
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().slice(0, 10));
  }

  const medications = getStoredJSON('fbMedications', []);
  const totalPossibleDoses = medications.length * 7; // Assuming daily medications

  container.innerHTML = days.map(date => {
    const dayHistory = history.filter(h => h.date === date && h.taken);
    const takenCount = dayHistory.length;
    const adherencePercent = totalPossibleDoses > 0 ? Math.round((takenCount / medications.length) * 100) : 0;

    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString([], { weekday: 'short' });

    return `
      <div class="adherence-day">
        <div class="day-label">${dayName}</div>
        <div class="adherence-bar">
          <div class="adherence-fill" style="height: ${adherencePercent}%"></div>
        </div>
        <div class="adherence-percent">${adherencePercent}%</div>
      </div>
    `;
  }).join('');

  // Update adherence stats
  updateAdherenceStats(history, medications);
}

// Update adherence statistics
function updateAdherenceStats(history, medications) {
  // Calculate weekly adherence
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekStart = weekAgo.toISOString().slice(0, 10);

  const weekHistory = history.filter(h => h.date >= weekStart && h.taken);
  const weeklyAdherence = medications.length > 0 ?
    Math.round((weekHistory.length / (medications.length * 7)) * 100) : 0;

  document.getElementById('weeklyAdherence').textContent = `${weeklyAdherence}%`;

  // Calculate current streak
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 30; i++) { // Check last 30 days
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().slice(0, 10);

    const dayHistory = history.filter(h => h.date === dateStr && h.taken);
    const requiredDoses = medications.length;

    if (dayHistory.length >= requiredDoses) {
      streak++;
    } else {
      break; // Streak broken
    }
  }

  document.getElementById('adherenceStreak').textContent = `${streak} days`;

  // Calculate best week
  let bestWeekPercent = 0;
  for (let i = 0; i < 4; i++) { // Check last 4 weeks
    const weekStartDate = new Date(weekAgo);
    weekStartDate.setDate(weekAgo.getDate() - (i * 7));
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 7);

    const weekStartStr = weekStartDate.toISOString().slice(0, 10);
    const weekEndStr = weekEndDate.toISOString().slice(0, 10);

    const weekHistoryCount = history.filter(h =>
      h.date >= weekStartStr && h.date < weekEndStr && h.taken
    ).length;

    const weekPercent = medications.length > 0 ?
      Math.round((weekHistoryCount / (medications.length * 7)) * 100) : 0;

    bestWeekPercent = Math.max(bestWeekPercent, weekPercent);
  }

  document.getElementById('bestWeek').textContent = `${bestWeekPercent}%`;
}

// Add new medication
function addMedication() {
  const form = `
    <form id="medicationForm">
      <div class="form-group">
        <label for="medName">Medication Name</label>
        <input type="text" id="medName" required>
      </div>

      <div class="form-group">
        <label for="medDosage">Dosage</label>
        <input type="text" id="medDosage" placeholder="e.g., 10mg, 1 tablet" required>
      </div>

      <div class="form-group">
        <label for="medPurpose">Purpose (optional)</label>
        <input type="text" id="medPurpose" placeholder="e.g., ADHD, anxiety">
      </div>

      <div class="form-group">
        <label for="medFrequency">Frequency</label>
        <select id="medFrequency" required>
          <option value="daily">Once daily</option>
          <option value="twice-daily">Twice daily</option>
          <option value="three-times-daily">Three times daily</option>
          <option value="as-needed">As needed</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div class="form-group">
        <label for="medDefaultTime">Default Time</label>
        <input type="time" id="medDefaultTime" required>
      </div>

      <div class="form-actions">
        <button type="button" onclick="hideModal()">Cancel</button>
        <button type="submit">Add Medication</button>
      </div>
    </form>
  `;

  showModal(form, { title: 'Add Medication', size: 'medium' });

  // Set up form submission
  setTimeout(() => {
    const formEl = document.getElementById('medicationForm');
    if (formEl) {
      formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        saveMedication();
      });
    }
  }, 100);
}

// Save medication from form
function saveMedication() {
  const name = document.getElementById('medName').value.trim();
  const dosage = document.getElementById('medDosage').value.trim();
  const purpose = document.getElementById('medPurpose').value.trim();
  const frequency = document.getElementById('medFrequency').value;
  const defaultTime = document.getElementById('medDefaultTime').value;

  if (!name || !dosage || !frequency || !defaultTime) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  const medications = getStoredJSON('fbMedications', []);
  const medication = {
    id: crypto.randomUUID(),
    name,
    dosage,
    purpose,
    frequency,
    defaultTime,
    created: new Date().toISOString()
  };

  medications.push(medication);
  setStoredJSON('fbMedications', medications);

  hideModal();
  loadMedicationData();

  logEvent('medication_added', 'tracker', 0, { medicationId: medication.id });
  showToast('Medication added successfully', 'success');
}

// Edit medication
function editMedication(id) {
  const medications = getStoredJSON('fbMedications', []);
  const medication = medications.find(m => m.id === id);

  if (!medication) return;

  // Populate form with existing data
  const form = `
    <form id="medicationForm">
      <div class="form-group">
        <label for="medName">Medication Name</label>
        <input type="text" id="medName" value="${medication.name}" required>
      </div>

      <div class="form-group">
        <label for="medDosage">Dosage</label>
        <input type="text" id="medDosage" value="${medication.dosage}" required>
      </div>

      <div class="form-group">
        <label for="medPurpose">Purpose (optional)</label>
        <input type="text" id="medPurpose" value="${medication.purpose || ''}">
      </div>

      <div class="form-group">
        <label for="medFrequency">Frequency</label>
        <select id="medFrequency" required>
          <option value="daily" ${medication.frequency === 'daily' ? 'selected' : ''}>Once daily</option>
          <option value="twice-daily" ${medication.frequency === 'twice-daily' ? 'selected' : ''}>Twice daily</option>
          <option value="three-times-daily" ${medication.frequency === 'three-times-daily' ? 'selected' : ''}>Three times daily</option>
          <option value="as-needed" ${medication.frequency === 'as-needed' ? 'selected' : ''}>As needed</option>
          <option value="weekly" ${medication.frequency === 'weekly' ? 'selected' : ''}>Weekly</option>
        </select>
      </div>

      <div class="form-group">
        <label for="medDefaultTime">Default Time</label>
        <input type="time" id="medDefaultTime" value="${medication.defaultTime}" required>
      </div>

      <div class="form-actions">
        <button type="button" onclick="hideModal()">Cancel</button>
        <button type="submit">Update Medication</button>
      </div>
    </form>
  `;

  showModal(form, { title: 'Edit Medication', size: 'medium' });

  // Set up form submission
  setTimeout(() => {
    const formEl = document.getElementById('medicationForm');
    if (formEl) {
      formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        updateMedication(id);
      });
    }
  }, 100);
}

// Update medication
function updateMedication(id) {
  const medications = getStoredJSON('fbMedications', []);
  const index = medications.findIndex(m => m.id === id);

  if (index === -1) return;

  const name = document.getElementById('medName').value.trim();
  const dosage = document.getElementById('medDosage').value.trim();
  const purpose = document.getElementById('medPurpose').value.trim();
  const frequency = document.getElementById('medFrequency').value;
  const defaultTime = document.getElementById('medDefaultTime').value;

  if (!name || !dosage || !frequency || !defaultTime) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  medications[index] = {
    ...medications[index],
    name,
    dosage,
    purpose,
    frequency,
    defaultTime,
    updated: new Date().toISOString()
  };

  setStoredJSON('fbMedications', medications);

  hideModal();
  loadMedicationData();

  showToast('Medication updated successfully', 'success');
}

// Delete medication
function deleteMedication(id) {
  if (!confirm('Are you sure you want to delete this medication? This action cannot be undone.')) {
    return;
  }

  const medications = getStoredJSON('fbMedications', []);
  const filtered = medications.filter(m => m.id !== id);

  setStoredJSON('fbMedications', filtered);

  // Also remove from history
  const history = getStoredJSON('fbMedicationHistory', []);
  const filteredHistory = history.filter(h => h.medicationId !== id);
  setStoredJSON('fbMedicationHistory', filteredHistory);

  loadMedicationData();

  logEvent('medication_deleted', 'tracker', 0, { medicationId: id });
  showToast('Medication deleted', 'warning');
}

// View medication history
function viewHistory() {
  const history = getStoredJSON('fbMedicationHistory', []);
  const medications = getStoredJSON('fbMedications', []);

  if (history.length === 0) {
    showToast('No medication history yet', 'info');
    return;
  }

  // Group history by date
  const historyByDate = {};
  history.forEach(entry => {
    if (!historyByDate[entry.date]) {
      historyByDate[entry.date] = [];
    }
    historyByDate[entry.date].push(entry);
  });

  // Sort dates descending
  const sortedDates = Object.keys(historyByDate).sort().reverse();

  const historyHTML = sortedDates.map(date => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString();
    const entries = historyByDate[date];

    const entriesHTML = entries.map(entry => {
      const med = medications.find(m => m.id === entry.medicationId);
      const medName = med ? med.name : 'Unknown medication';
      const time = entry.time || 'Unknown time';

      return `
        <div class="history-entry ${entry.taken ? 'taken' : 'missed'}">
          <span class="med-name">${medName}</span>
          <span class="med-time">${time}</span>
          <span class="status">${entry.taken ? '✓ Taken' : '✗ Missed'}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="history-date-group">
        <h4>${formattedDate}</h4>
        ${entriesHTML}
      </div>
    `;
  }).join('');

  showModal(`<div class="medication-history">${historyHTML}</div>`, {
    title: 'Medication History',
    size: 'large'
  });
}

// Set medication reminders
function setReminders() {
  const medications = getStoredJSON('fbMedications', []);

  if (medications.length === 0) {
    showToast('Add medications first to set reminders', 'warning');
    return;
  }

  // Check if notifications are supported
  if (!('Notification' in window)) {
    showToast('This browser does not support notifications', 'error');
    return;
  }

  // Request permission
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      showToast('Reminders enabled! You will be notified at medication times.', 'success');
      logEvent('reminders_enabled', 'medication', 0);
    } else {
      showToast('Notification permission denied', 'warning');
    }
  });
}