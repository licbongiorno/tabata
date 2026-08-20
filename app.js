'use strict';

/* ============================================================
   1. CONFIGURACIÓN PWA Y MOTIVACIÓN
   ============================================================ */
const manifest = {
  name: "Tabata Pro", short_name: "Tabata", display: "standalone",
  background_color: "#0B0E11", theme_color: "#0B0E11",
  icons: [{ src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzNGQzZGQiLz48L3N2Zz4=", sizes: "192x192", type: "image/svg+xml" }]
};
document.getElementById('pwa-manifest').href = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(manifest))}`;

const quotes = [
  "Respira profundo. Tú puedes.", "Mantén el ritmo.", "El descanso es parte del proceso.",
  "Un round menos, un tú mejor.", "Concéntrate en el siguiente movimiento."
];

/* ============================================================
   2. SCREEN WAKE LOCK API (Prevención de apagado)
   ============================================================ */
let wakeLock = null;
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
  } catch (err) { console.warn('Wake Lock no disponible', err); }
}
function releaseWakeLock() {
  if (wakeLock) { wakeLock.release().then(() => wakeLock = null); }
}

/* ============================================================
   3. ALMACENAMIENTO (IndexedDB Asíncrono)
   ============================================================ */
const DB = {
  init() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('TabataDB_v2', 1);
      req.onupgradeneeded = e => {
        if (!e.target.result.objectStoreNames.contains('stats')) {
          e.target.result.createObjectStore('stats', { keyPath: 'date' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async saveWork(seconds) {
    const db = await this.init();
    const date = new Date().toISOString().split('T')[0];
    const tx = db.transaction('stats', 'readwrite');
    const store = tx.objectStore('stats');
    const stat = await new Promise(res => {
      const getReq = store.get(date);
      getReq.onsuccess = () => res(getReq.result || { date, seconds: 0 });
    });
    stat.seconds += seconds;
    store.put(stat);
  },
  async getTodayStats() {
    const db = await this.init();
    const date = new Date().toISOString().split('T')[0];
    return new Promise(res => {
      const req = db.transaction('stats').objectStore('stats').get(date);
      req.onsuccess = () => res(req.result ? req.result.seconds : 0);
    });
  }
};

/* ============================================================
   4. AUDIO LOOK-AHEAD SCHEDULER
   ============================================================ */
class AudioEngine {
  constructor() { this.ctx = null; }
  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }
  playTone(freq, duration, type, startTime) {
    if(!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.5, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(startTime); osc.stop(startTime + duration + 0.1);
  }
  beepShort(time) { this.playTone(880, 0.1, 'square', time); }
  beepLong(time) { this.playTone(523.25, 0.4, 'sawtooth', time); }
}
const audio = new AudioEngine();

/* ============================================================
   5. MÁQUINA DE ESTADOS Y GPU RENDERER
   ============================================================ */
const UI = {
  ring: document.getElementById('ringProgress'), time: document.getElementById('timeDisplay'),
  badge: document.getElementById('phaseBadge'), line: document.getElementById('roundLine'),
  motivation: document.getElementById('motivationText'), app: document.getElementById('app'),
  btnPlay: document.getElementById('btnPlayPause'), btnStop: document.getElementById('btnStop'),
  btn10: document.getElementById('btnPlus10')
};

const RING_C = 2 * Math.PI * 100;
UI.ring.style.strokeDasharray = RING_C;

let CONFIG = { prep: 10, work: 20, rest: 10, rounds: 8, cycles: 1 };
let state = 'idle', sequence = [], seqIndex = 0, phaseEndTime = 0, remainingAtPause = 0;
let lastBeepedSecond = -1, uiInterval = null;

// Cargar Configuración de LocalStorage
const savedConfig = localStorage.getItem('tabata_cfg');
if(savedConfig) {
  CONFIG = JSON.parse(savedConfig);
  document.getElementById('inPrep').value = CONFIG.prep;
  document.getElementById('inWork').value = CONFIG.work;
  document.getElementById('inRest').value = CONFIG.rest;
  document.getElementById('inRounds').value = CONFIG.rounds;
  document.getElementById('inCycles').value = CONFIG.cycles;
}

function buildSequence() {
  sequence = [];
  if (CONFIG.prep > 0) sequence.push({ phase: 'prep', duration: CONFIG.prep, round: 0 });
  for (let c = 1; c <= CONFIG.cycles; c++) {
    for (let r = 1; r <= CONFIG.rounds; r++) {
      sequence.push({ phase: 'work', duration: CONFIG.work, round: r, cycle: c });
      if (CONFIG.rest > 0 && !(c === CONFIG.cycles && r === CONFIG.rounds)) {
        sequence.push({ phase: 'rest', duration: CONFIG.rest, round: r, cycle: c });
      }
    }
  }
  sequence.push({ phase: 'done', duration: 0, round: CONFIG.rounds });
}

function startRingAnimation(durationSec, remainingSec) {
  UI.ring.style.transition = 'none';
  UI.ring.style.strokeDashoffset = RING_C * (1 - (remainingSec / durationSec));
  void UI.ring.getBoundingClientRect(); // Reflow
  UI.ring.style.transition = `stroke-dashoffset ${remainingSec}s linear`;
  UI.ring.style.strokeDashoffset = RING_C;
}

function pauseRingAnimation() {
  const currentOffset = getComputedStyle(UI.ring).strokeDashoffset;
  UI.ring.style.transition = 'none';
  UI.ring.style.strokeDashoffset = currentOffset;
}

function updateDOMPhase(seg) {
  const meta = {
    idle: { l: 'LISTO', c: '--idle', i: '--ink' },
    prep: { l: 'PREPARACIÓN', c: '--prep', i: '--prep-ink' },
    work: { l: 'TRABAJO', c: '--work', i: '--work-ink' },
    rest: { l: 'DESCANSO', c: '--rest', i: '--rest-ink' },
    done: { l: 'COMPLETADO', c: '--done', i: '--done-ink' }
  };
  const m = meta[seg.phase];
  document.documentElement.style.setProperty('--phase-color', `var(${m.c})`);
  document.documentElement.style.setProperty('--phase-ink', `var(${m.i})`);
  UI.badge.textContent = m.l;
  
  if (seg.phase === 'done') UI.line.textContent = '¡Excelente trabajo!';
  else if (seg.phase === 'prep') UI.line.textContent = 'Prepárate...';
  else UI.line.textContent = `Ronda ${seg.round} de ${CONFIG.rounds} (Ciclo ${seg.cycle}/${CONFIG.cycles})`;

  // Motivación dinámica y Hápticos
  if (seg.phase === 'prep' || seg.phase === 'rest') {
    UI.motivation.textContent = quotes[Math.floor(Math.random() * quotes.length)];
  } else { UI.motivation.textContent = ""; }

  if (navigator.vibrate) navigator.vibrate(seg.phase === 'work' ? [200, 50, 200] : 100);
}

function tick() {
  if (state !== 'running') return;
  const now = performance.now();
  let remaining = (phaseEndTime - now) / 1000;
  const currentSeg = sequence[seqIndex];

  if (remaining <= 0) {
    if (currentSeg.phase === 'work') DB.saveWork(currentSeg.duration);
    seqIndex++;
    if (seqIndex >= sequence.length) { stopEngine(true); return; }
    
    const nextSeg = sequence[seqIndex];
    phaseEndTime = now + (nextSeg.duration * 1000);
    remaining = nextSeg.duration;
    lastBeepedSecond = -1;
    updateDOMPhase(nextSeg);
    startRingAnimation(nextSeg.duration, remaining);
    audio.beepLong(audio.ctx.currentTime);
  }

  const displaySecs = Math.max(0, Math.ceil(remaining));
  const timeStr = `${String(Math.floor(displaySecs / 60)).padStart(2, '0')}:${String(displaySecs % 60).padStart(2, '0')}`;
  if (UI.time.textContent !== timeStr) UI.time.textContent = timeStr;

  if (remaining <= 3.2 && displaySecs <= 3 && displaySecs > 0 && lastBeepedSecond !== displaySecs) {
    lastBeepedSecond = displaySecs;
    audio.beepShort(audio.ctx.currentTime);
    if (navigator.vibrate) navigator.vibrate(50);
  }
}

function togglePlay() {
  audio.init();
  if (state === 'idle') {
    buildSequence(); seqIndex = 0;
    updateDOMPhase(sequence[0]);
    phaseEndTime = performance.now() + (sequence[0].duration * 1000);
    startRingAnimation(sequence[0].duration, sequence[0].duration);
    state = 'running';
    UI.app.classList.add('deep-focus');
    UI.btnStop.disabled = false; UI.btn10.disabled = false;
    UI.btnPlay.innerHTML = '⏸ Pausar';
    uiInterval = setInterval(tick, 200);
    requestWakeLock();
  } else if (state === 'running') {
    state = 'paused'; clearInterval(uiInterval);
    remainingAtPause = phaseEndTime - performance.now();
    pauseRingAnimation();
    UI.app.classList.remove('deep-focus');
    UI.btnPlay.innerHTML = '▶ Continuar';
    releaseWakeLock();
  } else if (state === 'paused') {
    state = 'running';
    phaseEndTime = performance.now() + remainingAtPause;
    startRingAnimation(sequence[seqIndex].duration, remainingAtPause / 1000);
    UI.app.classList.add('deep-focus');
    UI.btnPlay.innerHTML = '⏸ Pausar';
    uiInterval = setInterval(tick, 200);
    requestWakeLock();
  }
}

function stopEngine(completed = false) {
  state = 'idle'; clearInterval(uiInterval);
  UI.ring.style.transition = 'stroke-dashoffset 0.5s ease';
  UI.ring.style.strokeDashoffset = 0;
  UI.app.classList.remove('deep-focus');
  UI.btnPlay.innerHTML = '▶ Comenzar';
  UI.btnStop.disabled = true; UI.btn10.disabled = true;
  releaseWakeLock();
  
  if (completed) {
    updateDOMPhase({ phase: 'done', round: 0 }); UI.time.textContent = '00:00';
  } else {
    updateDOMPhase({ phase: 'idle', round: 0 });
    UI.time.textContent = String(Math.floor(CONFIG.work/60)).padStart(2,'0') + ':' + String(CONFIG.work%60).padStart(2,'0');
  }
}

/* ============================================================
   6. EVENTOS (UI, Settings, Stats y Teclado)
   ============================================================ */
UI.btnPlay.addEventListener('click', togglePlay);
UI.btnStop.addEventListener('click', () => { if(confirm("¿Detener sesión actual?")) stopEngine(false); });
UI.btn10.addEventListener('click', () => {
  if (state === 'idle') return;
  sequence[seqIndex].duration += 10;
  if (state === 'running') {
    phaseEndTime += 10000;
    startRingAnimation(sequence[seqIndex].duration, (phaseEndTime - performance.now()) / 1000);
  } else { remainingAtPause += 10000; tick(); }
});

// Settings Modal
const mSettings = document.getElementById('modalSettings');
document.getElementById('btnSettings').addEventListener('click', () => mSettings.classList.add('active'));
document.getElementById('btnSaveSettings').addEventListener('click', () => {
  CONFIG = {
    prep: parseInt(document.getElementById('inPrep').value)||0,
    work: parseInt(document.getElementById('inWork').value)||1,
    rest: parseInt(document.getElementById('inRest').value)||0,
    rounds: parseInt(document.getElementById('inRounds').value)||1,
    cycles: parseInt(document.getElementById('inCycles').value)||1
  };
  localStorage.setItem('tabata_cfg', JSON.stringify(CONFIG));
  mSettings.classList.remove('active');
  if(state === 'idle') stopEngine(false); // Refresca UI
});

// Stats Modal
const mStats = document.getElementById('modalStats');
document.getElementById('btnStats').addEventListener('click', async () => {
  const seconds = await DB.getTodayStats();
  document.getElementById('statMinutes').textContent = (seconds / 60).toFixed(1);
  mStats.classList.add('active');
});
document.getElementById('btnCloseStats').addEventListener('click', () => mStats.classList.remove('active'));

// Tema
const themeSwitch = document.getElementById('themeSwitch');
themeSwitch.addEventListener('change', (e) => {
  document.documentElement.setAttribute('data-theme', e.target.checked ? 'light' : 'dark');
});

// Atajos teclado
window.addEventListener('keydown', e => {
  if (e.code === 'Space' && !mSettings.classList.contains('active')) { e.preventDefault(); togglePlay(); }
});

stopEngine(false); // Init
