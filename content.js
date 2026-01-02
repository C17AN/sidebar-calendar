// Parsing logic mirrored from utils/dateParser.js
function parseDates(text) {
  const dates = [];
  
  const normalizeYear = (y) => {
    if (y.length === 2) {
      return `20${y}`;
    }
    return y;
  };

  const isoRegex = /\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/g;
  let match;
  while ((match = isoRegex.exec(text)) !== null) {
    const year = match[1];
    const month = match[2].padStart(2, '0');
    const day = match[3].padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }

  const numRegex = /\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})\b/g;
  while ((match = numRegex.exec(text)) !== null) {
    let p1 = parseInt(match[1], 10);
    let p2 = parseInt(match[2], 10);
    const yearRaw = match[3];
    const year = normalizeYear(yearRaw);

    let month, day;

    if (p1 > 12) {
      day = p1.toString().padStart(2, '0');
      month = p2.toString().padStart(2, '0');
    } else {
      month = p1.toString().padStart(2, '0');
      day = p2.toString().padStart(2, '0');
    }

    const normalized = `${year}-${month}-${day}`;
    if (parseInt(month) <= 12 && parseInt(day) <= 31) {
       if (!dates.includes(normalized)) dates.push(normalized);
    }
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
      const dayRaw = match[1] || match[3] || "01"; 
      const day = dayRaw.padStart(2, '0');
      const year = normalizeYear(match[4]);
      
      const normalized = `${year}-${month}-${day}`;
      if (!dates.includes(normalized)) dates.push(normalized);
    }
  }

  return [...new Set(dates)].filter(d => !isNaN(new Date(d).getTime()));
}

// UI Handling for Add Overlay
let addOverlayHost = null;

function removeAddOverlay() {
  if (addOverlayHost) {
    addOverlayHost.remove();
    addOverlayHost = null;
  }
}

function createAddOverlay(x, y, date, initialText) {
  removeAddOverlay();

  addOverlayHost = document.createElement('div');
  addOverlayHost.style.position = 'absolute';
  addOverlayHost.style.left = `${x}px`;
  addOverlayHost.style.top = `${y}px`;
  addOverlayHost.style.zIndex = '2147483647';
  addOverlayHost.style.pointerEvents = 'auto';

  const shadow = addOverlayHost.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    .container {
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 8px;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      gap: 5px;
      width: 220px;
    }
    .row {
      display: flex;
      gap: 5px;
    }
    input {
      width: 100%;
      padding: 4px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      box-sizing: border-box;
    }
    button {
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      flex: 1;
    }
    .btn-save {
      background: #1a73e8;
      color: white;
    }
    .btn-save:hover { background: #1557b0; }
    .btn-cancel {
      background: #f1f3f4;
      color: #333;
    }
    .btn-cancel:hover { background: #e8eaed; }
    
    .initial-btn {
      background: #1a73e8;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .success-msg {
      color: #188038;
      font-weight: bold;
      padding: 5px;
      text-align: center;
    }
  `;

  let safeTitle = initialText.replace(/\s+/g, ' ').trim();
  if (safeTitle.length > 30) safeTitle = safeTitle.substring(0, 30) + '...';

  const container = document.createElement('div');
  
  const initialBtn = document.createElement('button');
  initialBtn.className = 'initial-btn';
  initialBtn.textContent = `Add D-Day: ${date}`;
  initialBtn.onclick = () => {
    renderForm();
  };
  
  function renderForm() {
    container.innerHTML = '';
    container.className = 'container';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = safeTitle;
    input.placeholder = 'Event Title';
    
    // ENTER Key Handler
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveAction();
      }
    });

    const btnRow = document.createElement('div');
    btnRow.className = 'row';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-save';
    saveBtn.textContent = 'Save';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = removeAddOverlay;

    const saveAction = () => {
      const title = input.value || 'D-Day';
      chrome.runtime.sendMessage({ type: 'ADD_DDAY', date, title }, (response) => {
        if (response && response.success) {
          container.innerHTML = '<div class="success-msg">✓ Saved!</div>';
          setTimeout(removeAddOverlay, 1500);
        } else {
          removeAddOverlay();
        }
      });
    };

    saveBtn.onclick = saveAction;

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(saveBtn);
    container.appendChild(input);
    container.appendChild(btnRow);
    
    setTimeout(() => input.focus(), 50);
  }

  container.appendChild(initialBtn);
  shadow.appendChild(style);
  shadow.appendChild(container);

  document.body.appendChild(addOverlayHost);
}

document.addEventListener('mouseup', (e) => {
  if (addOverlayHost && e.target === addOverlayHost) {
    return;
  }

  const selection = window.getSelection();
  const text = selection.toString().trim();

  if (!text) {
    removeAddOverlay();
    return;
  }

  const dates = parseDates(text);
  if (dates.length > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const x = rect.right + window.scrollX + 10;
    const y = rect.top + window.scrollY;
    createAddOverlay(x, y, dates[0], text);
  } else {
    removeAddOverlay();
  }
});

window.addEventListener('scroll', removeAddOverlay, true);
window.addEventListener('resize', removeAddOverlay);


// --- Reminder Pill Logic ---

async function checkTodaySchedule() {
  const result = await chrome.storage.local.get('dday_items');
  const items = result.dday_items || [];
  
  // Use local time for "today"
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;
  
  const todayItems = items.filter(item => item.date === todayStr);

  if (todayItems.length > 0) {
    createReminderPill(todayItems);
  }
}

function createReminderPill(items) {
  const pillHost = document.createElement('div');
  pillHost.style.position = 'fixed';
  pillHost.style.bottom = '20px';
  pillHost.style.right = '20px';
  pillHost.style.zIndex = '2147483647';
  
  const shadow = pillHost.attachShadow({ mode: 'open' });
  
  const style = document.createElement('style');
  style.textContent = `
    .pill {
      background: #1a73e8;
      color: white;
      padding: 10px 16px;
      border-radius: 24px;
      font-family: sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .pill:hover {
      transform: scale(1.05);
    }
    .content {
      display: flex;
      flex-direction: column;
    }
    .title {
      font-weight: bold;
    }
    .details {
      font-size: 12px;
      opacity: 0.9;
    }
    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
      padding: 0 4px;
      opacity: 0.7;
    }
    .close-btn:hover { opacity: 1; }
  `;

  const pill = document.createElement('div');
  pill.className = 'pill';
  
  // Click Handler to Open Side Panel
  pill.onclick = () => {
    chrome.runtime.sendMessage({ type: 'OPEN_SIDE_PANEL' });
  };
  
  const content = document.createElement('div');
  content.className = 'content';
  
  const title = document.createElement('span');
  title.className = 'title';
  title.textContent = `Today: ${items.length} Event${items.length > 1 ? 's' : ''}`;
  
  const details = document.createElement('span');
  details.className = 'details';
  const displayTitles = items.slice(0, 2).map(i => i.title || 'D-Day').join(', ');
  details.textContent = displayTitles + (items.length > 2 ? '...' : '');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '×';
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    pillHost.remove();
  };

  content.appendChild(title);
  content.appendChild(details);
  pill.appendChild(content);
  pill.appendChild(closeBtn);

  shadow.appendChild(style);
  shadow.appendChild(pill);
  
  document.body.appendChild(pillHost);
}

checkTodaySchedule();
