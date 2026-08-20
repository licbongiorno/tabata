'use strict';

const dbzQuotes = {
  prep: [
    "¡Eleva tu Ki al máximo!",
    "Respira... reúne toda tu energía.",
    "¡Concéntrate! La batalla está por comenzar.",
    "Muéstrame el verdadero poder de tu entrenamiento."
  ],
  work: [
    "¡Kaio-ken aumentado a 20 veces!",
    "¡Supera tus propios límites, como un guerrero Saiyajin!",
    "¡Kamehamehaaaaa!",
    "¡Poder al 100%! ¡No te rindas ahora!",
    "Ese es el orgullo de nuestra raza. ¡Sigue!",
    "¡Resplandor Final!"
  ],
  rest: [
    "Come una semilla del ermitaño.",
    "Baja tu Ki temporalmente. Recupérate.",
    "Incluso Goku necesita un momento para respirar.",
    "La pelea aún no termina. Recupera el aliento."
  ]
};

let wakeLock = null;
async function requestWakeLock() { try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (e) {} }
function releaseWakeLock() { if (wakeLock) wakeLock.release().then(() => wakeLock = null); }

const DB = {
  init() {
    return new Promise((res, rej) => {
      const req = indexedDB.open('TabataDB_Z', 1);
      req.onupgradeneeded = e => { if (!e.target.result.objectStoreNames.contains('stats')) e.target.result.createObjectStore('stats', { keyPath: 'date' }); };
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
  },
  async saveWork(seconds) {
    const db = await this.init();
    const date = new Date().toISOString().split('T')[0];
    const tx = db.transaction('stats', 'readwrite');
    const store = tx.objectStore('stats');
    const stat = await new Promise(r => { const req = store.get(date); req.onsuccess = () => r(req.result || { date, seconds: 0 }); });
    stat.seconds += seconds; store.put(stat);
  },
  async getTodayStats() {
    const db = await this.init();
    const date = new Date().toISOString().split('T')[0];
    return new Promise(r => { const req = db.transaction('stats').objectStore('stats').get(date); req.onsuccess = () => r(req.result ? req.result.seconds : 0); });
  }
};

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
  // Sonido especial simulando cargar energía (Aura)
  powerUpTone(startTime) {
    if(!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, startTime);
    osc.frequency.exponentialRampToValueAtTime(800, startTime + 0.4);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.4, startTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(startTime); osc.stop(startTime + 0.6);
  }
  beepShort(time) { this.playTone(880, 0.1, 'square', time); }
  beepLong(time) { this.playTone(523.25, 0.4, 'sawtooth', time); }
}
const audio = new AudioEngine();

const UI = {
  ring: document.getElementById('ringProgress'), time: document.getElementById('timeDisplay'),
  badge: document.getElementById('phaseBadge'), line: document.getElementById('roundLine'),
  motivation: document.getElementById('motivationText'), app: document.getElementById('app'),
  btnPlay: document.getElementById('btnPlayPause'), btnStop: document.getElementById('btnStop'),
  btn10: document.getElementById('btnPlus10'), btnPrev: document.getElementById('btnPrev'),
  btnNext: document.getElementById('btnNext'), holder: document.getElementById('ringHolder')
};

const RING_C = 2 * Math.PI * 100;
UI.ring.style.strokeDasharray = RING_C;

let CONFIG = { prep: 10, work: 20, rest: 10, rounds: 8, cycles: 1 };
let state = 'idle', sequence = [], seqIndex = 0, phaseEndTime = 0, remainingAtPause = 0, lastBeepedSecond = -1, uiInterval = null;

const savedConfig = localStorage.getItem('tabata_z_cfg');
if(savedConfig) {
  CONFIG = JSON.parse(savedConfig);
  document.getElementById('inPrep').value = CONFIG.prep; document.getElementById('inWork').value = CONFIG.work;
  document.getElementById('inRest').value = CONFIG.rest; document.getElementById('inRounds').value = CONFIG.rounds;
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

function getWorkTransformation(round) {
  const pct = round / CONFIG.rounds;
  if (pct <= 0.35) return { name: 'SUPER SAIYAJIN', hex: '#FFD700', ink: '#332B00' }; // Dorado
  if (pct <= 0.75) return { name: 'SSJ BLUE', hex: '#00BFFF', ink: '#002633' };       // Azul
  return { name: 'ULTRA INSTINTO', hex: '#FFFFFF', ink: '#1A1A1A' };                  // Plateado/Blanco
}

function startRingAnimation(durationSec, remainingSec) {
  UI.ring.style.transition = 'none';
  UI.ring.style.strokeDashoffset = RING_C * (1 - (remainingSec / durationSec));
  void UI.ring.getBoundingClientRect(); 
  UI.ring.style.transition = `stroke-dashoffset ${remainingSec}s linear`;
  UI.ring.style.strokeDashoffset = RING_C;
}

function pauseRingAnimation() {
  const currentOffset = getComputedStyle(UI.ring).strokeDashoffset;
  UI.ring.style.transition = 'none'; UI.ring.style.strokeDashoffset = currentOffset;
}

function triggerShake() {
  UI.holder.classList.remove('shake');
  void UI.holder.offsetWidth;
  UI.holder.classList.add('shake');
}

function updateDOMPhase(seg) {
  let colorVar, inkVar, badgeText;
  
  if (seg.phase === 'work') {
    const trans = getWorkTransformation(seg.round);
    document.documentElement.style.setProperty('--work-dynamic', trans.hex);
    document.documentElement.style.setProperty('--work-ink-dynamic', trans.ink);
    colorVar = '--work-dynamic'; inkVar = '--work-ink-dynamic';
    badgeText = trans.name;
    triggerShake(); // Estallido visual al empezar a pelear
  } else {
    const meta = {
      idle: { l: 'ESTADO BASE', c: '--idle', i: '--ink' },
      prep: { l: 'CARGANDO KI', c: '--prep', i: '--prep-ink' },
      rest: { l: 'RECUPERACIÓN', c: '--rest', i: '--rest-ink' },
      done: { l: '¡VICTORIA!', c: '--done', i: '--done-ink' }
    };
    colorVar = meta[seg.phase].c; inkVar = meta[seg.phase].i; badgeText = meta[seg.phase].l;
  }

  document.documentElement.style.setProperty('--phase-color', `var(${colorVar})`);
  document.documentElement.style.setProperty('--phase-ink', `var(${inkVar})`);
  UI.badge.textContent = badgeText;
  
  if (seg.phase === 'done') UI.line.textContent = 'Guerrero legendario';
  else if (seg.phase === 'prep') UI.line.textContent = 'Prepárate para la batalla...';
  else UI.line.textContent = `Ronda ${seg.round} de ${CONFIG.rounds} (Ciclo ${seg.cycle}/${CONFIG.cycles})`;

  if(seg.phase !== 'idle' && seg.phase !== 'done') {
    const pool = dbzQuotes[seg.phase] || dbzQuotes.work;
    UI.motivation.textContent = pool[Math.floor(Math.random() * pool.length)];
  } else { UI.motivation.textContent = ""; }

  // Vibración táctil intensa en Work, pulsos suaves en Rest
  if (navigator.vibrate) {
    if(seg.phase === 'work') navigator.vibrate([100, 50, 100, 50, 300]); // Patrón explosivo
    else if(seg.phase === 'rest') navigator.vibrate(100);
  }
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
    
    if(nextSeg.phase === 'work') audio.powerUpTone(audio.ctx.currentTime);
    else audio.beepLong(audio.ctx.currentTime);
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

function setControlsEnabled(enabled) {
  UI.btnStop.disabled = !enabled; UI.btn10.disabled = !enabled;
  UI.btnPrev.disabled = !enabled; UI.btnNext.disabled = !enabled;
}

function togglePlay() {
  audio.init();
  if (state === 'idle') {
    buildSequence(); seqIndex = 0;
    updateDOMPhase(sequence[0]);
    phaseEndTime = performance.now() + (sequence[0].duration * 1000);
    startRingAnimation(sequence[0].duration, sequence[0].duration);
    state = 'running'; UI.app.classList.add('deep-focus'); setControlsEnabled(true);
    UI.btnPlay.innerHTML = '⏸ Pausa';
    uiInterval = setInterval(tick, 200); requestWakeLock();
  } else if (state === 'running') {
    state = 'paused'; clearInterval(uiInterval);
    remainingAtPause = phaseEndTime - performance.now();
    pauseRingAnimation(); UI.app.classList.remove('deep-focus');
    UI.btnPlay.innerHTML = '▶ Continuar'; releaseWakeLock();
  } else if (state === 'paused') {
    state = 'running'; phaseEndTime = performance.now() + remainingAtPause;
    startRingAnimation(sequence[seqIndex].duration, remainingAtPause / 1000);
    UI.app.classList.add('deep-focus'); UI.btnPlay.innerHTML = '⏸ Pausa';
    uiInterval = setInterval(tick, 200); requestWakeLock();
  }
}

function stopEngine(completed = false) {
  state = 'idle'; clearInterval(uiInterval);
  UI.ring.style.transition = 'stroke-dashoffset 0.5s ease'; UI.ring.style.strokeDashoffset = 0;
  UI.app.classList.remove('deep-focus'); UI.btnPlay.innerHTML = '▶ Comenzar';
  setControlsEnabled(false); releaseWakeLock();
  
  if (completed) { updateDOMPhase({ phase: 'done', round: 0 }); UI.time.textContent = '00:00'; } 
  else {
    updateDOMPhase({ phase: 'idle', round: 0 });
    UI.time.textContent = String(Math.floor(CONFIG.work/60)).padStart(2,'0') + ':' + String(CONFIG.work%60).padStart(2,'0');
  }
}

function skipPhase(direction) {
  if (state === 'idle') return;
  const currentSeg = sequence[seqIndex], now = performance.now();
  let remaining = state === 'running' ? (phaseEndTime - now) / 1000 : remainingAtPause / 1000;

  if (currentSeg.phase === 'work') {
    const elapsed = currentSeg.duration - Math.max(0, remaining);
    if (elapsed > 0) DB.saveWork(elapsed);
  }

  if (direction === 'next' && seqIndex < sequence.length - 1) seqIndex++; 
  else if (direction === 'prev' && seqIndex > 0) seqIndex--; 
  else return;

  const nextSeg = sequence[seqIndex];
  remainingAtPause = nextSeg.duration * 1000; phaseEndTime = now + remainingAtPause;
  lastBeepedSecond = -1; updateDOMPhase(nextSeg);
  
  if (state === 'running') {
    startRingAnimation(nextSeg.duration, nextSeg.duration);
    if(nextSeg.phase === 'work') audio.powerUpTone(audio.ctx.currentTime);
    else audio.beepLong(audio.ctx.currentTime);
  } else {
    pauseRingAnimation(); UI.ring.style.strokeDashoffset = 0;
    UI.time.textContent = `${String(Math.floor(nextSeg.duration / 60)).padStart(2, '0')}:${String(nextSeg.duration % 60).padStart(2, '0')}`;
  }
}

UI.btnPlay.addEventListener('click', togglePlay);
UI.btnStop.addEventListener('click', () => { if(confirm("¿Rendirte ahora? Se perderá el progreso.")) stopEngine(false); });
UI.btnPrev.addEventListener('click', () => skipPhase('prev'));
UI.btnNext.addEventListener('click', () => skipPhase('next'));
UI.btn10.addEventListener('click', () => {
  if (state === 'idle') return;
  sequence[seqIndex].duration += 10;
  if (state === 'running') {
    phaseEndTime += 10000;
    startRingAnimation(sequence[seqIndex].duration, (phaseEndTime - performance.now()) / 1000);
  } else { remainingAtPause += 10000; tick(); }
});

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
  localStorage.setItem('tabata_z_cfg', JSON.stringify(CONFIG));
  mSettings.classList.remove('active');
  if(state === 'idle') stopEngine(false); 
});

const mStats = document.getElementById('modalStats');
document.getElementById('btnStats').addEventListener('click', async () => {
  const seconds = await DB.getTodayStats();
  document.getElementById('statMinutes').textContent = (seconds / 60).toFixed(1);
  mStats.classList.add('active');
});
document.getElementById('btnCloseStats').addEventListener('click', () => mStats.classList.remove('active'));

window.addEventListener('keydown', e => {
  if (e.code === 'Space' && !mSettings.classList.contains('active')) { e.preventDefault(); togglePlay(); }
  if (e.code === 'ArrowRight' && state !== 'idle') skipPhase('next');
  if (e.code === 'ArrowLeft' && state !== 'idle') skipPhase('prev');
});

stopEngine(false);
