# Routine Tracker

Personal daily-level tracker. Pick a level each day, it locks until midnight, then resets and saves to history.

## Structure
- `index.html` – page shell
- `css/styles.css` – all styling and colour themes
- `js/config.js` – level names, colours, placeholder tasks, storage key
- `js/storage.js` – load and save (localStorage)
- `js/logic.js` – daily lock, midnight reset, history, ticking tasks
- `js/views.js` – the Today, History and Settings screens
- `js/app.js` – taps, timers, startup

## Hosting
Serve over https (e.g. GitHub Pages). The scripts are ES modules, so opening index.html straight from a file will not work.
