// Settings and defaults. Edit level names, colours and placeholder tasks here.
export const STORAGE_KEY = 'routine_tracker_v1';

export const LEVELS = {
  1: { name: 'Basic day', desc: 'Light list, still real progress', color: 'var(--l1)' },
  2: { name: 'Good day',  desc: 'Recommended: clears the whole day', color: 'var(--l2)' },
  3: { name: 'Elite day', desc: 'For days off work only', color: 'var(--l3)' }
};

const task = (n) => 'Placeholder task ' + n;
const tasks = (count) => Array.from({ length: count }, (_, i) => task(i + 1));

export function getDefaults() {
  return {
    tasks: { 1: tasks(3), 2: tasks(6), 3: tasks(9) },
    state: { day: '', level: null, tasks: [], done: [] },
    history: []
  };
}
