// Everything that builds screens. Each view returns an HTML string.
import { store } from './storage.js';
import { LEVELS } from './config.js';
import { untilMidnight } from './logic.js';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ESC[c]);

function todayView() {
  const { state, tasks } = store.data;
  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  let h = '<h1>Today</h1><div class="sub">' + date + '</div>';

  if (!state.level) {
    h += '<div class="card alarm"><b>⏰ No level chosen yet</b><div class="note">Pick your level for today. It locks until midnight.</div></div>';
    [1, 2, 3].forEach((n) => {
      const m = LEVELS[n];
      h += '<div class="card lv" style="--c:' + m.color + '"><h3>Level ' + n + ' · ' + m.name + '</h3><p>' + m.desc + '</p><ul>' +
        tasks[n].map((t) => '<li>' + esc(t) + '</li>').join('') +
        '</ul><button data-act="pick" data-n="' + n + '">Choose Level ' + n + '</button></div>';
    });
    return h;
  }

  const m = LEVELS[state.level];
  const pct = state.tasks.length ? Math.round(state.done.length / state.tasks.length * 100) : 0;
  h += '<div class="card lv" style="--c:' + m.color + '"><span class="pill">Level ' + state.level + '</span> <b>' + m.name + '</b> 🔒' +
    '<div class="bar"><i style="width:' + pct + '%"></i></div>' +
    '<div class="note">' + state.done.length + ' of ' + state.tasks.length + ' done · locked, resets in <span id="cd">' + untilMidnight() + '</span></div></div>';
  h += '<div class="card lv" style="--c:' + m.color + '">' + state.tasks.map((t, i) => {
    const on = state.done.indexOf(i) > -1;
    return '<div class="task' + (on ? ' on' : '') + '" data-act="tog" data-i="' + i + '"><div class="box">' + (on ? '✓' : '') + '</div><span>' + esc(t) + '</span></div>';
  }).join('') + '</div>';
  return h;
}

function historyView() {
  const { history } = store.data;
  let h = '<h1>History</h1><div class="sub">Saved automatically at every midnight reset</div><div class="card">';
  if (!history.length) h += '<div class="note">Nothing yet. Your first day is saved when it resets at midnight.</div>';
  history.forEach((r) => {
    const m = r.level ? LEVELS[r.level] : null;
    h += '<div class="row"><span>' + r.day + '</span>' +
      (m ? '<span class="pill" style="--c:' + m.color + '">Level ' + r.level + '</span>' : '<span class="note">No level chosen</span>') +
      '<span>' + (r.total ? r.done + '/' + r.total : '–') + '</span></div>';
  });
  return h + '</div>';
}

function settingsView() {
  const { tasks } = store.data;
  let h = '<h1>Settings</h1><div class="sub">Edit level</div>';
  [1, 2, 3].forEach((n) => {
    h += '<div class="card lv" style="--c:' + LEVELS[n].color + '"><h3>Level ' + n + ' tasks</h3>' +
      '<textarea id="ta' + n + '">' + esc(tasks[n].join('\n')) + '</textarea><div class="note">One task per line.</div></div>';
  });
  h += '<button data-act="savetasks" style="--c:var(--text)">Save tasks</button>';
  h += '<p class="note">Edits apply from the next time a level is chosen. Today’s locked list is not changed.</p>';
  h += '<div class="card"><b>Alarm</b><div class="note">Set a repeating daily alarm in the iPhone Clock app labelled “Choose your level”. Cancel it only after you pick.</div></div>';
  h += '<button class="ghost" data-act="sim">Test: simulate midnight</button>';
  return h;
}

const VIEWS = { today: todayView, history: historyView, settings: settingsView };
const TABS = [['today', '✅', 'Today'], ['history', '📅', 'History'], ['settings', '⚙️', 'Settings']];

export function render(tab) {
  document.getElementById('app').innerHTML = VIEWS[tab]();
  document.getElementById('nav').innerHTML = TABS.map((t) =>
    '<a class="' + (tab === t[0] ? 'on' : '') + '" data-tab="' + t[0] + '"><span>' + t[1] + '</span>' + t[2] + '</a>'
  ).join('');
}
