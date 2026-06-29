export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage setItem error', e);
  }
}

export function getItem(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('LocalStorage getItem error', e);
    return defaultValue;
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('LocalStorage removeItem error', e);
  }
}
