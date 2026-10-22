// Loading and saving. All data lives in the phone's localStorage.
import { STORAGE_KEY, getDefaults } from './config.js';

export const store = { data: null };

export function load() {
  let parsed = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    parsed = raw ? JSON.parse(raw) : null;
  } catch (e) {
    parsed = null;
  }
  store.data = parsed && parsed.tasks && parsed.state ? parsed : getDefaults();
}

export function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.data));
  } catch (e) {
    /* storage unavailable: app still works for this session */
  }
}
