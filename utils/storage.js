export const STORAGE_KEYS = {
  ITEMS: 'dday_items',
  SETTINGS: 'dday_settings'
};

export async function getItems() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.ITEMS);
  return result[STORAGE_KEYS.ITEMS] || [];
}

export async function saveItems(items) {
  await chrome.storage.local.set({ [STORAGE_KEYS.ITEMS]: items });
}

export async function addItem(dateOrItem, title = 'D-Day') {
  const items = await getItems();
  let newItem;
  
  if (typeof dateOrItem === 'object') {
    newItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      ...dateOrItem
    };
  } else {
    newItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date: dateOrItem,
      title,
      createdAt: Date.now()
    };
  }
  
  items.push(newItem);
  await saveItems(items);
  return newItem;
}

export async function updateItem(id, updates) {
  const items = await getItems();
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    await saveItems(items);
  }
}

export async function deleteItem(id) {
  const items = await getItems();
  const filtered = items.filter(item => item.id !== id);
  await saveItems(filtered);
}

export async function getSettings() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
  return result[STORAGE_KEYS.SETTINGS] || { leadHours: 0 };
}

export async function saveSettings(settings) {
  await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings });
}
