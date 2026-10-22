// Entry point: wires up taps, timers and startup.
import { load } from './storage.js';
import { rollover, untilMidnight, chooseLevel, toggleTask, saveTasks, simulateMidnight } from './logic.js';
import { render } from './views.js';

let tab = 'today';
const draw = () => render(tab);

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-tab]');
  if (t) { tab = t.dataset.tab; draw(); window.scrollTo(0, 0); return; }

  const a = e.target.closest('[data-act]');
  if (!a) return;
  const act = a.dataset.act;

  if (act === 'pick') {
    const n = +a.dataset.n;
    if (confirm('Lock in Level ' + n + ' for today? You can’t switch until midnight.')) { chooseLevel(n); draw(); }
  }
  if (act === 'tog') { toggleTask(+a.dataset.i); draw(); }
  if (act === 'savetasks') {
    saveTasks({ 1: document.getElementById('ta1').value, 2: document.getElementById('ta2').value, 3: document.getElementById('ta3').value });
    alert('Tasks saved.');
  }
  if (act === 'sim') { simulateMidnight(); tab = 'today'; draw(); }
});

// Midnight check every 30 seconds, plus a live countdown.
setInterval(() => {
  if (rollover()) { draw(); return; }
  const c = document.getElementById('cd');
  if (c) c.textContent = untilMidnight();
}, 30000);

// Also check when you come back to the app after it was in the background.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && rollover()) draw();
});

load();
rollover();
draw();
