import { parseDates } from './utils/dateParser.js';
import { getItems, addItem, updateItem, deleteItem, getSettings, saveSettings, STORAGE_KEYS } from './utils/storage.js';

// DOM Elements
const currentMonthEl = document.getElementById('current-month');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const calendarGrid = document.getElementById('calendar-grid');
const nextUpList = document.getElementById('next-up-list');
const dropOverlay = document.getElementById('drop-zone-overlay');
const weekdaysHeader = document.getElementById('weekdays-header');

// Settings Elements
const btnSettings = document.getElementById('btn-settings');
const settingsDialog = document.getElementById('settings-dialog');
const btnCloseSettings = document.getElementById('btn-close-settings');
const leadHoursInput = document.getElementById('leadHours');
const languageSelect = document.getElementById('language-select');
const themeSelect = document.getElementById('theme-select');

// Labels for Translation
const labels = {
  'label-next-up': { 'en-US': 'NEXT UP', 'ko-KR': '다음 일정' },
  'label-settings': { 'en-US': 'Settings', 'ko-KR': '설정' },
  'label-theme': { 'en-US': 'Theme', 'ko-KR': '테마' },
  'label-language': { 'en-US': 'Language', 'ko-KR': '언어' },
  'label-lead-time': { 'en-US': 'Lead Time (Hours)', 'ko-KR': '알림 시간 (시간 전)' },
  'btn-close-settings': { 'en-US': 'Done', 'ko-KR': '완료' },
  'btn-settings': { 'en-US': '⚙️ Settings', 'ko-KR': '⚙️ 설정' },
  
  'label-edit-event': { 'en-US': 'Edit Event', 'ko-KR': '일정 수정' },
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

async function renderDashboard() {
  const settings = await getSettings();
  currentLang = settings.language || 'en-US';
  
  // Apply Theme
  document.body.setAttribute('data-mode', settings.themeMode || 'dark');
  
  applyTranslations();
  renderCalendar(currentDate);
  const items = await getItems();
  renderNextUp(items);
}

function applyTranslations() {
  // Update static text
  for (const [id, texts] of Object.entries(labels)) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = texts[currentLang] || texts['en-US'];
    }
  }
  
  // Update weekdays
  weekdaysHeader.innerHTML = '';
  const weekdays = currentLang === 'ko-KR' 
    ? ['일', '월', '화', '수', '목', '금', '토'] 
    : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
  weekdays.forEach(day => {
    const span = document.createElement('span');
    span.textContent = day;
    weekdaysHeader.appendChild(span);
  });
  
  // Update Theme Option Text (Simple toggle)
  const darkOpt = themeSelect.querySelector('option[value="dark"]');
  const lightOpt = themeSelect.querySelector('option[value="light"]');
  if (currentLang === 'ko-KR') {
    darkOpt.textContent = '다크 모드';
    lightOpt.textContent = '라이트 모드';
  } else {
    darkOpt.textContent = 'Dark';
    lightOpt.textContent = 'Light';
  }
}

async function renderCalendar(date) {
  const items = await getItems();
  const year = date.getFullYear();
  const month = date.getMonth(); 
  
  const monthName = date.toLocaleDateString(currentLang, { month: 'long' });
  currentMonthEl.textContent = `${monthName} ${year}`; 
  if (currentLang === 'ko-KR') {
     currentMonthEl.textContent = `${year}년 ${monthName}`;
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
    
    if (isCurrentMonth && d === today.getDate()) {
      cell.classList.add('today');
    }
    
    const hasEvent = items.some(item => item.date === dayStr);
    if (hasEvent) {
      const dot = document.createElement('div');
      dot.className = 'event-dot';
      cell.appendChild(dot);
    }

    calendarGrid.appendChild(cell);
  }
}

function renderNextUp(items) {
  nextUpList.innerHTML = '';
  
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const nowStr = `${year}-${month}-${day}`;

  const upcoming = items
    .filter(item => item.date >= nowStr)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
    
  if (upcoming.length === 0) {
    const emptyText = currentLang === 'ko-KR' ? '다가오는 일정이 없습니다' : 'No upcoming events';
    nextUpList.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:20px;">${emptyText}</div>`;
    return;
  }
  
  upcoming.forEach(item => {
    const dateObj = new Date(item.date);
    const monthShort = dateObj.toLocaleDateString(currentLang, { month: 'short' }).toUpperCase();
    const dayNum = dateObj.getDate();
    
    const card = document.createElement('div');
    card.className = 'event-card';
    card.title = currentLang === 'ko-KR' ? '클릭하여 수정' : 'Click to Edit';
    
    let titleHtml = item.title || 'D-Day';
    if (item.link) {
      titleHtml = `<a href="${item.link}" target="_blank" onclick="event.stopPropagation()">${item.title || 'D-Day'} 🔗</a>`;
    }

    let detailsHtml = '';
    if (item.time) detailsHtml += `<span>🕒 ${item.time}</span>`;
    if (item.location) detailsHtml += `<span>📍 ${item.location}</span>`;
    
    const allDayText = currentLang === 'ko-KR' ? '하루 종일' : 'All Day';
    if (!item.time && !item.location) detailsHtml = allDayText;

    card.innerHTML = `
      <div class="date-box">
        <span class="month">${monthShort}</span>
        <span class="day">${dayNum}</span>
      </div>
      <div class="info">
        <div class="title">${titleHtml}</div>
        <div class="details">${detailsHtml}</div>
      </div>
    `;
    
    card.addEventListener('click', () => openEditDialog(item));

    const syncBtn = document.createElement('button');
    syncBtn.innerHTML = '📅';
    syncBtn.style.cssText = 'background:none;border:none;color:var(--text-muted);font-size:1.2rem;cursor:pointer;padding:0 4px;margin-left:auto;';
    syncBtn.title = currentLang === 'ko-KR' ? '수정' : 'Edit';
    syncBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openEditDialog(item);
    };
    card.appendChild(syncBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '×';
    deleteBtn.style.cssText = 'background:none;border:none;color:var(--text-muted);font-size:1.2rem;cursor:pointer;padding:0 4px;';
    deleteBtn.title = currentLang === 'ko-KR' ? '삭제' : 'Delete';
    deleteBtn.onclick = async (e) => {
      e.stopPropagation();
      const confirmText = currentLang === 'ko-KR' ? '이 일정을 삭제하시겠습니까?' : 'Delete this event?';
      if(confirm(confirmText)) {
        await deleteItem(item.id);
      }
    };
    card.appendChild(deleteBtn);

    nextUpList.appendChild(card);
  });
}

function openEditDialog(item) {
  editingItemId = item.id;
  editTitle.value = item.title || '';
  editDate.value = item.date;
  editTime.value = item.time || '';
  editLocation.value = item.location || '';
  editLink.value = item.link || '';
  
  editDialog.showModal();
}

btnCancelEdit.addEventListener('click', () => editDialog.close());

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (editingItemId) {
    await updateItem(editingItemId, {
      title: editTitle.value,
      date: editDate.value,
      time: editTime.value,
      location: editLocation.value,
      link: editLink.value
    });
    editDialog.close();
    renderDashboard();
  }
});


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
  document.body.setAttribute('data-mode', settings.themeMode);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    renderDashboard();
  }
});

(async () => {
  const settings = await getSettings();
  leadHoursInput.value = settings.leadHours || 0;
  languageSelect.value = settings.language || 'en-US';
  themeSelect.value = settings.themeMode || 'dark';
  renderDashboard();
})();
