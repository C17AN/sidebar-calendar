import { getItems, addItem } from './storage.js';

/**
 * Authenticate with Google and return the token.
 */
function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(token);
      }
    });
  });
}

/**
 * Fetch events from the primary calendar.
 * Range: 3 months ago to 1 year ahead.
 */
async function fetchGCalEvents(token) {
  const now = new Date();
  const start = new Date();
  start.setMonth(now.getMonth() - 3);
  const end = new Date();
  end.setFullYear(now.getFullYear() + 1);

  const timeMin = start.toISOString();
  const timeMax = end.toISOString();

  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=250`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`GCal API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Create an event in Google Calendar.
 */
async function createGCalEvent(token, item) {
  const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
  
  // Construct event resource
  // If item.time exists, use dateTime. Else use date (all-day).
  const resource = {
    summary: item.title,
    location: item.location || '',
    description: `Imported from Drag D-Day${item.link ? '\nLink: ' + item.link : ''}`,
  };

  if (item.time) {
    // Has time: YYYY-MM-DD + HH:MM
    const dateTime = new Date(`${item.date}T${item.time}:00`);
    resource.start = { dateTime: dateTime.toISOString() };
    resource.end = { dateTime: new Date(dateTime.getTime() + 3600000).toISOString() }; // +1 hour
  } else {
    // All day
    resource.start = { date: item.date };
    resource.end = { date: item.date }; // GCal all-day end is exclusive, but usually same day is fine for display or +1 day.
    // Wait, GCal end date is exclusive. So 2023-01-01 to 2023-01-02 is one day.
    // I should add 1 day to date.
    const d = new Date(item.date);
    d.setDate(d.getDate() + 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    resource.end = { date: `${year}-${month}-${day}` };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resource),
  });

  if (!response.ok) {
    console.error('Failed to create event', await response.text());
  }
}

/**
 * Main Sync Function
 * 1. Import GCal events -> Extension (Dedup by Title + Date)
 * 2. Export Extension events -> GCal (Dedup by Title + Date)
 */
export async function syncGoogleCalendar() {
  try {
    const token = await getAuthToken();
    const gcalEvents = await fetchGCalEvents(token);
    const localItems = await getItems();

    let addedToLocal = 0;
    let addedToGCal = 0;

    // 1. Import GCal -> Local
    for (const event of gcalEvents) {
      if (event.status === 'cancelled') continue;

      let dateStr = '';
      let timeStr = '';

      if (event.start.date) {
        // All day
        dateStr = event.start.date;
      } else if (event.start.dateTime) {
        // Has time
        const dt = new Date(event.start.dateTime);
        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const day = String(dt.getDate()).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
        
        const hh = String(dt.getHours()).padStart(2, '0');
        const mm = String(dt.getMinutes()).padStart(2, '0');
        timeStr = `${hh}:${mm}`;
      }

      const title = event.summary || '(No Title)';
      
      // Check duplicate
      const exists = localItems.some(i => i.date === dateStr && i.title === title);
      
      if (!exists) {
        await addItem({
          title: title,
          date: dateStr,
          time: timeStr,
          location: event.location || '',
          link: event.htmlLink || ''
        });
        addedToLocal++;
      }
    }

    // 2. Export Local -> GCal
    // We only export items that are likely within the fetched range to avoid dups or massive historical dumps
    // Simple check: Is the local item in GCal?
    // We check against the `gcalEvents` list we just fetched.
    
    // Refresh local items since we just added some? 
    // No, we iterate the *original* localItems to avoid re-exporting what we just imported (though existing check handles it).
    
    for (const item of localItems) {
      // Check if this item exists in the fetched GCal list
      // Matching logic: Same date (roughly) and same title.
      // Note: GCal all-day might differ by timezone if not careful, but dateStr should match event.start.date
      
      const existsInGCal = gcalEvents.some(g => {
        let gDate = '';
        if (g.start.date) gDate = g.start.date;
        else if (g.start.dateTime) {
           const dt = new Date(g.start.dateTime);
           gDate = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
        }
        return gDate === item.date && g.summary === item.title;
      });

      if (!existsInGCal) {
        // Add to GCal
        await createGCalEvent(token, item);
        addedToGCal++;
      }
    }

    return { success: true, addedToLocal, addedToGCal };

  } catch (error) {
    console.error('Sync Error:', error);
    return { success: false, error: error.message };
  }
}
