// The rules: daily lock, midnight reset, history, task ticking.
import { store, save } from './storage.js';

const pad = (n) => String(n).padStart(2, '0');

export function dateKey(d = new Date()) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

// Runs the midnight reset if the date has changed. Returns true if it reset.
export function rollover() {
  const d = store.data;
  const t = dateKey();
  if (d.state.day === t) return false;
  if (d.state.day) {
    d.history.unshift({
      day: d.state.day,
      level: d.state.level,
      done: d.state.done.length,
      total: d.state.tasks.length
    });
    d.history = d.history.slice(0, 60);
  }
  d.state = { day: t, level: null, tasks: [], done: [] };
  save();
  return true;
}

export function untilMidnight() {
  const n = new Date();
  const m = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
  const mins = Math.floor((m - n) / 60000);
  return Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm';
}

export function chooseLevel(n) {
  const d = store.data;
  d.state.level = n;
  d.state.tasks = d.tasks[n].slice();
  d.state.done = [];
  save();
}

export function toggleTask(i) {
  const done = store.data.state.done;
  const k = done.indexOf(i);
  if (k > -1) done.splice(k, 1); else done.push(i);
  save();
}

// lists = { 1: 'text\nwith\nlines', 2: '...', 3: '...' }
export function saveTasks(lists) {
  [1, 2, 3].forEach((n) => {
    store.data.tasks[n] = lists[n].split('\n').map((s) => s.trim()).filter(Boolean);
  });
  save();
}

// Test helper: pretends the day was yesterday, then runs the reset.
export function simulateMidnight() {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  store.data.state.day = dateKey(y);
  rollover();
}
