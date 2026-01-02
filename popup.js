import { parseDates } from './utils/dateParser.js';
import { getItems, addItem, updateItem, deleteItem, getSettings, saveSettings, STORAGE_KEYS } from './utils/storage.js';

// DOM Elements
const currentMonthEl = document.getElementById('current-month');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const calendarGrid = document.getElementById('calendar-grid');
const weekdaysHeader = document.getElementById('weekdays-header');

// Sections
const selectedDateSection = document.getElementById('selected-date-section');
const selectedDateList = document.getElementById('selected-date-list');
const nextUpSection = document.getElementById('next-up-section');
const nextUpList = document.getElementById('next-up-list');
const emptyState = document.getElementById('empty-state');
const btnAddEmpty = document.getElementById('btn-add-empty');
const labelSelectedDateHeader = document.getElementById('label-selected-date-header');
const labelNextUp = document.getElementById('label-next-up');

// Settings Elements
const btnSettings = document.getElementById('btn-settings');
const settingsDialog = document.getElementById('settings-dialog');
const btnCloseSettings = document.getElementById('btn-close-settings');
const leadHoursInput = document.getElementById('leadHours');
const languageSelect = document.getElementById('language-select');
const themeSelect = document.getElementById('theme-select');

// Manual Add
const btnAddManual = document.getElementById('btn-add-manual');
const dropOverlay = document.getElementById('drop-zone-overlay');

// Labels for Translation
const labels = {
  'label-next-up': { 'en-US': 'NEXT UP', 'ko-KR': '다음 일정' },
  'label-settings': { 'en-US': 'Settings', 'ko-KR': '설정' },
  'label-theme': { 'en-US': 'Theme', 'ko-KR': '테마' },
  'label-language': { 'en-US': 'Language', 'ko-KR': '언어' },
  'label-lead-time': { 'en-US': 'Lead Time (Hours)', 'ko-KR': '알림 시간 (시간 전)' },
  'btn-close-settings': { 'en-US': 'Done', 'ko-KR': '완료' },
  'btn-settings': { 'en-US': '⚙️ Settings', 'ko-KR': '⚙️ 설정' },
  'btn-add-manual': { 'en-US': '+ Add New Event', 'ko-KR': '+ 새 일정 추가하기' },

  'label-edit-event': { 'en-US': 'Edit Event', 'ko-KR': '일정 수정' },
  'label-add-event': { 'en-US': 'Add Event', 'ko-KR': '새 일정 추가' },
  'label-title': { 'en-US': 'Title', 'ko-KR': '제목' },
  'label-date': { 'en-US': 'Date', 'ko-KR': '날짜' },
  'label-time': { 'en-US': 'Time (Optional)', 'ko-KR': '시간 (선택)' },
  'label-location': { 'en-US': 'Location (Optional)', 'ko-KR': '장소 (선택)' },
  'label-link': { 'en-US': 'Link (Optional)', 'ko-KR': '링크 (선택)' },
  'btn-cancel-edit': { 'en-US': 'Cancel', 'ko-KR': '취소' },
  'btn-save-edit': { 'en-US': 'Save', 'ko-KR': '저장' },
};

// Edit Dialog Elements
const editDialog = document.getElementById('edit-event-dialog');
const editForm = document.getElementById('edit-event-form');
const editTitle = document.getElementById('edit-title');
const editDate = document.getElementById('edit-date');
const editTime = document.getElementById('edit-time');
const editLocation = document.getElementById('edit-location');
const editLink = document.getElementById('edit-link');
const btnCancelEdit = document.getElementById('btn-cancel-edit');

let currentDate = new Date();
let editingItemId = null;
let currentLang = 'en-US';
let selectedDateStr = null;

async function renderDashboard() {
  const settings = await getSettings();
  currentLang = settings.language || 'en-US';

  applyThemeMode(settings.themeMode || 'system');
  applyTranslations();
  renderCalendar(currentDate);
  const items = await getItems();
  renderLists(items);
}

function applyThemeMode(mode) {
  let actualMode = mode;
  if (mode === 'system') {
    actualMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.body.setAttribute('data-mode', actualMode);
}

function applyTranslations() {
  for (const [id, texts] of Object.entries(labels)) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = texts[currentLang] || texts['en-US'];
    }
  }

  weekdaysHeader.innerHTML = '';
  const weekdays = currentLang === 'ko-KR'
    ? ['일', '월', '화', '수', '목', '금', '토']
    : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  weekdays.forEach(day => {
    const span = document.createElement('span');
    span.textContent = day;
    weekdaysHeader.appendChild(span);
  });

  const systemOpt = themeSelect.querySelector('option[value="system"]');
  const darkOpt = themeSelect.querySelector('option[value="dark"]');
  const lightOpt = themeSelect.querySelector('option[value="light"]');
  if (currentLang === 'ko-KR') {
    systemOpt.textContent = '시스템 설정';
    darkOpt.textContent = '다크 모드';
    lightOpt.textContent = '라이트 모드';
  } else {
    systemOpt.textContent = 'System';
    darkOpt.textContent = 'Dark';
    lightOpt.textContent = 'Light';
  }
}

async function renderCalendar(date) {
  const items = await getItems();
  const year = date.getFullYear();
  const month = date.getMonth();

  const monthName = date.toLocaleDateString(currentLang, { month: 'long' });
  if (currentLang === 'ko-KR') {
    currentMonthEl.textContent = `${year}년 ${monthName}`;
  } else {
    currentMonthEl.textContent = `${monthName} ${year}`;
  }

  calendarGrid.innerHTML = '';
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDayOfMonth.getDay();

  for (let i = 0; i < startDay; i++) {
    const pad = document.createElement('div');
    pad.className = 'day-cell prev-month';
    calendarGrid.appendChild(pad);
  }

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const cell = document.createElement('div');
    cell.className = 'day-cell current-month';
    cell.textContent = d;
    if (isCurrentMonth && d === today.getDate()) cell.classList.add('today');
    if (selectedDateStr === dayStr) cell.classList.add('selected');

    const hasEvent = items.some(item => item.date === dayStr);
    if (hasEvent) {
      const dot = document.createElement('div');
      dot.className = 'event-dot';
      cell.appendChild(dot);
    }

    cell.addEventListener('click', () => {
      selectedDateStr = (selectedDateStr === dayStr) ? null : dayStr;
      renderCalendar(currentDate);
      renderLists(items);
    });
    calendarGrid.appendChild(cell);
  }
}

function renderLists(items) {
  const hasAnyItems = items.length > 0;
  const now = new Date();
  const nowStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const upcomingItems = items
    .filter(item => item.date >= nowStr)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Initial visibility reset
  selectedDateSection.classList.add('hidden');
  nextUpSection.classList.add('hidden');
  emptyState.classList.add('hidden');

  if (selectedDateStr) {
    // 1. Date is selected
    selectedDateSection.classList.remove('hidden');
    updateSelectedDateHeader();
    const dayItems = items.filter(item => item.date === selectedDateStr);
    renderEventCards(selectedDateList, dayItems);

    // Requirement: Hide Next Up ONLY IF there are no items AT ALL in storage
    if (hasAnyItems) {
      nextUpSection.classList.remove('hidden');
      renderEventCards(nextUpList, upcomingItems);
    }
  } else {
    // 2. No date selected
    nextUpSection.classList.remove('hidden'); // Always show "NEXT UP" text
    
    if (upcomingItems.length > 0) {
      renderEventCards(nextUpList, upcomingItems);
    } else {
      renderEventCards(nextUpList, []); // Clear list
      emptyState.classList.remove('hidden'); // Show "Add Manual" button
    }
  }
}

function updateSelectedDateHeader() {
  const selDate = new Date(selectedDateStr);
  const mName = selDate.toLocaleDateString(currentLang, { month: 'long' });
  const dNum = selDate.getDate();
  labelSelectedDateHeader.textContent = currentLang === 'ko-KR'
    ? `${mName} ${dNum}일 일정`
    : `${mName} ${dNum} Schedule`;
}

function renderEventCards(container, listItems) {
  container.innerHTML = '';
  if (listItems.length === 0) {
    return;
  }

  listItems.forEach(item => {
    const card = createEventCard(item);
    container.appendChild(card);
  });
}

function createEventCard(item) {
  const dateObj = new Date(item.date);
  const monthShort = dateObj.toLocaleDateString(currentLang, { month: 'short' }).toUpperCase();
  const dayNum = dateObj.getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(item.date);
  targetDate.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
  let ddayText = diffDays === 0 ? 'D-Day' : (diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`);

  // Calculate urgency class
  let urgencyClass = 'future';
  if (diffDays === 0) {
    urgencyClass = 'urgent';
  } else if (diffDays > 0 && diffDays <= 2) {
    urgencyClass = 'near';
  } else if (diffDays > 2 && diffDays <= 5) {
    urgencyClass = 'soon';
  } else if (diffDays > 5 && diffDays <= 14) {
    urgencyClass = 'calm';
  } else if (diffDays > 14) {
    urgencyClass = 'future';
  } else if (diffDays < 0) {
    urgencyClass = 'past';
  }

  const card = document.createElement('div');
  card.className = 'event-card';
  card.title = currentLang === 'ko-KR' ? '클릭하여 수정' : 'Click to Edit';

  let titleHtml = item.title || 'Event';
  if (item.link) titleHtml = `<a href="${item.link}" target="_blank">${item.title || 'Event'} 🔗</a>`;

  let detailsHtml = '';
  if (item.time) detailsHtml += `<span>🕒 ${item.time}</span>`;
  if (item.location) detailsHtml += `<span>📍 ${item.location}</span>`;
  if (!item.time && !item.location) detailsHtml = currentLang === 'ko-KR' ? '하루 종일' : 'All Day';

  card.innerHTML = `
    <div class="date-box">
      <span class="dday-badge ${urgencyClass}">${ddayText}</span>
      <span class="month">${monthShort}</span>
      <span class="day">${dayNum}</span>
    </div>
    <div class="info">
      <div class="title">
        <span class="title-content">${titleHtml}</span>
      </div>
      <div class="details">${detailsHtml}</div>
    </div>
  `;

  card.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') return; // Let link click through
    openEditDialog(item);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '×';
  deleteBtn.className = 'delete-btn-card'; 
  deleteBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const confirmText = currentLang === 'ko-KR' ? '이 일정을 삭제하시겠습니까?' : 'Delete this event?';
    if (confirm(confirmText)) await deleteItem(item.id);
  });
  card.appendChild(deleteBtn);

  return card;
}

function openEditDialog(item = null) {
  const dialogTitle = document.getElementById('label-edit-event');

  if (item) {
    editingItemId = item.id;
    dialogTitle.textContent = labels['label-edit-event'][currentLang];
    editTitle.value = item.title || '';
    editDate.value = item.date;
    editTime.value = item.time || '';
    editLocation.value = item.location || '';
    editLink.value = item.link || '';
  } else {
    // New item mode
    editingItemId = null;
    dialogTitle.textContent = labels['label-add-event'][currentLang];
    editTitle.value = '';
    // Use selectedDateStr or today in local time
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    editDate.value = selectedDateStr || todayStr;
    editTime.value = '';
    editLocation.value = '';
    editLink.value = '';
  }
  editDialog.showModal();
}

btnCancelEdit.addEventListener('click', () => editDialog.close());

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const updates = {
    title: editTitle.value,
    date: editDate.value,
    time: editTime.value,
    location: editLocation.value,
    link: editLink.value
  };

  if (editingItemId) {
    await updateItem(editingItemId, updates);
  } else {
    await addItem(updates);
  }
  editDialog.close();
  renderDashboard(); // Explicitly re-render to be sure
});

btnAddManual.addEventListener('click', () => openEditDialog(null));
btnAddEmpty.addEventListener('click', () => openEditDialog(null));

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderDashboard();
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderDashboard();
});

document.addEventListener('dragenter', (e) => {
  e.preventDefault();
  dropOverlay.classList.remove('hidden');
});
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('dragleave', (e) => {
  if (e.relatedTarget === null) dropOverlay.classList.add('hidden');
});
document.addEventListener('drop', async (e) => {
  e.preventDefault();
  dropOverlay.classList.add('hidden');
  const text = e.dataTransfer.getData('text/plain');
  if (text) {
    const dates = parseDates(text);
    for (const d of dates) await addItem(d);
  }
});

btnSettings.addEventListener('click', () => settingsDialog.showModal());
btnCloseSettings.addEventListener('click', () => settingsDialog.close());

leadHoursInput.addEventListener('change', async () => {
  const settings = await getSettings();
  settings.leadHours = parseInt(leadHoursInput.value) || 0;
  await saveSettings(settings);
});

languageSelect.addEventListener('change', async () => {
  const settings = await getSettings();
  settings.language = languageSelect.value;
  await saveSettings(settings);
});

themeSelect.addEventListener('change', async () => {
  const settings = await getSettings();
  settings.themeMode = themeSelect.value;
  await saveSettings(settings);
  applyThemeMode(settings.themeMode);
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async () => {
  const settings = await getSettings();
  if (settings.themeMode === 'system') applyThemeMode('system');
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') renderDashboard();
});

(async () => {
  const settings = await getSettings();
  leadHoursInput.value = settings.leadHours || 0;
  languageSelect.value = settings.language || 'en-US';
  themeSelect.value = settings.themeMode || 'system';
  renderDashboard();
})();
