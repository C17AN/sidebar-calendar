// Parsing logic mirrored from utils/dateParser.js
function parseDates(text) {
  const dates = [];
  const normalizeYear = (y) => (y.length === 2 ? `20${y}` : y);
  const isoRegex = /\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/g;
  let match;
  while ((match = isoRegex.exec(text)) !== null) {
    dates.push(`${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`);
  }
  const numRegex = /\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})\b/g;
  while ((match = numRegex.exec(text)) !== null) {
    let p1 = parseInt(match[1], 10), p2 = parseInt(match[2], 10);
    const year = normalizeYear(match[3]);
    let month, day;
    if (p1 > 12) { day = p1.toString().padStart(2, '0'); month = p2.toString().padStart(2, '0'); } 
    else { month = p1.toString().padStart(2, '0'); day = p2.toString().padStart(2, '0'); }
    if (parseInt(month) <= 12 && parseInt(day) <= 31) dates.push(`${year}-${month}-${day}`);
  }
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const longMonthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const allMonths = [...monthNames, ...longMonthNames].join('|');
  const textDateRegex = new RegExp(`\b(\d{1,2})?\s*(${allMonths})\s*(\d{1,2})?,?\s*(\d{2}|\d{4})\b`, 'gi');
  while ((match = textDateRegex.exec(text)) !== null) {
    const monthStr = match[2].toLowerCase();
    let monthIdx = monthNames.indexOf(monthStr.substring(0, 3));
    if (monthIdx === -1) monthIdx = longMonthNames.indexOf(monthStr);
    if (monthIdx !== -1) {
      const month = (monthIdx + 1).toString().padStart(2, '0');
      const day = (match[1] || match[3] || "01").padStart(2, '0');
      const year = normalizeYear(match[4]);
      dates.push(`${year}-${month}-${day}`);
    }
  }
  return [...new Set(dates)].filter(d => !isNaN(new Date(d).getTime()));
}

// --- Settings & State ---
let currentSettings = {
  language: 'en-US',
  themeMode: 'system'
};

async function syncSettings() {
  const res = await chrome.storage.local.get(['dday_settings']);
  if (res.dday_settings) {
    currentSettings = { ...currentSettings, ...res.dday_settings };
  }
}

function t(key) {
  // Map internal keys to i18n keys
  const keyMap = {
    'add': 'contentAdd',
    'save': 'contentSave',
    'cancel': 'contentCancel',
    'saved': 'contentSaved',
    'today': 'contentToday',
    'placeholder': 'contentPlaceholder'
  };
  return chrome.i18n.getMessage(keyMap[key] || key);
}

function getActualMode() {
  const mode = currentSettings.themeMode || 'system';
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

// --- UI Handling ---
let addOverlayHost = null;

function removeAddOverlay() {
  if (addOverlayHost) { addOverlayHost.remove(); addOverlayHost = null; }
}

function createAddOverlay(x, y, date, initialText) {
  removeAddOverlay();
  addOverlayHost = document.createElement('div');
  Object.assign(addOverlayHost.style, { position: 'absolute', left: `${x}px`, top: `${y}px`, zIndex: '2147483647', pointerEvents: 'auto' });
  const shadow = addOverlayHost.attachShadow({ mode: 'open' });
  const mode = getActualMode();

  const style = document.createElement('style');
  style.textContent = `
    :host {
      --bg: ${mode === 'dark' ? '#1e1f2b' : '#ffffff'};
      --text: ${mode === 'dark' ? '#ffffff' : '#202124'};
      --primary: ${mode === 'dark' ? '#246bfd' : '#1a73e8'};
      --border: ${mode === 'dark' ? '#2a2b36' : '#dadce0'};
      --input-bg: ${mode === 'dark' ? '#0e1015' : '#f8f9fa'};
    }
    .container {
      background: var(--bg); color: var(--text); border: 1px solid var(--border);
      border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      padding: 12px; font-family: sans-serif; display: flex; flex-direction: column; gap: 8px; width: 220px;
    }
    input {
      width: 100%; padding: 8px; border: 1px solid var(--border); border-radius: 6px;
      font-size: 13px; box-sizing: border-box; background: var(--input-bg); color: var(--text);
    }
    .row { display: flex; gap: 8px; }
    button { border: none; padding: 8px 12px; border-radius: 20px; font-size: 12px; cursor: pointer; flex: 1; font-weight: 600; }
    .btn-save { background: var(--primary); color: white; }
    .btn-cancel { background: var(--input-bg); color: var(--text); border: 1px solid var(--border); }
    .initial-btn {
      background: var(--primary); color: white; border: none; padding: 10px 16px; border-radius: 20px;
      font-size: 14px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-weight: 600; white-space: nowrap;
    }
    .success-msg { color: #188038; font-weight: bold; text-align: center; padding: 4px; }
  `;

  let safeTitle = initialText.replace(/\s+/g, ' ').trim();
  if (safeTitle.length > 30) safeTitle = safeTitle.substring(0, 30) + '...';

  const container = document.createElement('div');
  const initialBtn = document.createElement('button');
  initialBtn.className = 'initial-btn';
  initialBtn.textContent = `${t('add')}: ${date}`;
  initialBtn.addEventListener('click', () => renderForm());
  
  function renderForm() {
    container.innerHTML = ''; container.className = 'container';
    const input = document.createElement('input');
    input.type = 'text'; input.value = ''; // Clear value to show placeholder
    input.placeholder = t('placeholder');
    
    const saveAction = () => {
      const title = input.value || 'D-Day';
      chrome.runtime.sendMessage({ type: 'ADD_DDAY', date, title }, (res) => {
        if (res?.success) { 
          container.innerHTML = `<div class="success-msg">${t('saved')}</div>`; 
          setTimeout(removeAddOverlay, 1500); 
        } else {
          removeAddOverlay();
        }
      });
    };

    input.addEventListener('keydown', (e) => { 
      if (e.key === 'Enter') saveAction(); 
    });

    const btnRow = document.createElement('div'); btnRow.className = 'row';
    const saveBtn = document.createElement('button'); saveBtn.className = 'btn-save'; saveBtn.textContent = t('save');
    const cancelBtn = document.createElement('button'); cancelBtn.className = 'btn-cancel'; cancelBtn.textContent = t('cancel');
    
    cancelBtn.addEventListener('click', removeAddOverlay);
    saveBtn.addEventListener('click', saveAction);

    btnRow.append(cancelBtn, saveBtn); container.append(input, btnRow);
    setTimeout(() => input.focus(), 50);
  }

  initialBtn.addEventListener('click', () => renderForm());
  container.appendChild(initialBtn);
  shadow.append(style, container);
  document.body.appendChild(addOverlayHost);
}

document.addEventListener('mouseup', (e) => {
  if (addOverlayHost && e.composedPath().includes(addOverlayHost)) return;
  const selection = window.getSelection();
  const text = selection.toString().trim();
  if (!text) { removeAddOverlay(); return; }
  const dates = parseDates(text);
  if (dates.length > 0) {
    const range = selection.getRangeAt(0), rect = range.getBoundingClientRect();
    createAddOverlay(rect.right + window.scrollX + 10, rect.top + window.scrollY, dates[0], text);
  } else removeAddOverlay();
});

window.addEventListener('scroll', removeAddOverlay, true);
window.addEventListener('resize', removeAddOverlay);

// --- Reminder Pill ---
async function checkTodaySchedule() {
  const result = await chrome.storage.local.get(['dday_items', 'last_reminder_close_time']);
  const items = result.dday_items || [];
  const lastCloseTime = result.last_reminder_close_time || 0;
  
  // Don't show if closed within the last hour
  if (Date.now() - lastCloseTime < 3600000) {
    const existing = document.getElementById('dday-reminder-pill');
    if (existing) existing.remove();
    return;
  }

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const todayItems = items.filter(item => item.date === todayStr);
  if (todayItems.length > 0) createReminderPill(todayItems);
  else {
    const existing = document.getElementById('dday-reminder-pill');
    if (existing) existing.remove();
  }
}

function createReminderPill(items) {
  const existing = document.getElementById('dday-reminder-pill');
  if (existing) existing.remove();

  const pillHost = document.createElement('div');
  pillHost.id = 'dday-reminder-pill';
  Object.assign(pillHost.style, { position: 'fixed', bottom: '20px', right: '20px', zIndex: '2147483647' });
  const shadow = pillHost.attachShadow({ mode: 'open' });
  const mode = getActualMode();

  const style = document.createElement('style');
  style.textContent = `
    .pill {
      background: ${mode === 'dark' ? '#246bfd' : '#1a73e8'}; color: white; padding: 10px 16px;
      border-radius: 24px; font-family: sans-serif; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex; align-items: center; gap: 10px; cursor: pointer; transition: transform 0.2s;
    }
    .pill:hover { transform: scale(1.05); }
    .content { display: flex; flex-direction: column; }
    .title { font-weight: bold; }
    .details { font-size: 12px; opacity: 0.9; }
    .close-btn { background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 0 4px; opacity: 0.7; }
  `;

  const pill = document.createElement('div'); pill.className = 'pill';
  pill.addEventListener('click', () => chrome.runtime.sendMessage({ type: 'OPEN_SIDE_PANEL' }));
  const content = document.createElement('div'); content.className = 'content';
  const title = document.createElement('span'); title.className = 'title';
  title.textContent = `${t('today')}: ${items.length}`;
  const details = document.createElement('span'); details.className = 'details';
  details.textContent = items.slice(0, 2).map(i => i.title || 'D-Day').join(', ') + (items.length > 2 ? '...' : '');
  const closeBtn = document.createElement('button'); closeBtn.className = 'close-btn'; closeBtn.textContent = '×';
  closeBtn.addEventListener('click', (e) => { 
    e.stopPropagation(); 
    chrome.storage.local.set({ last_reminder_close_time: Date.now() });
    pillHost.remove(); 
  });
  content.append(title, details); pill.append(content, closeBtn);
  shadow.append(style, pill);
  document.body.appendChild(pillHost);
}

// Initial Sync
syncSettings().then(checkTodaySchedule);

// Listen for settings changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.dday_settings || changes.dday_items || changes.last_reminder_close_time) {
    syncSettings().then(() => {
      // Re-render pill if items changed or mode changed
      checkTodaySchedule();
    });
  }
});