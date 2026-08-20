'use strict';

/* ============================================================
   MOTOR MULTIVERSO (10 Temáticas)
   ============================================================ */
const MULTIVERSO = {
  dbz: {
    appTitle: "TABATA Z", fontName: "Bangers",
    fontUrl: "https://fonts.googleapis.com/css2?family=Bangers&display=swap",
    colors: { prep: "#FF8C00", work: "#FFD700", rest: "#3EC6FF", done: "#2CE8A1" }, // Work es dinámico
    quotes: {
      prep: ["¡Eleva tu Ki al máximo!", "Prepárate para la batalla..."],
      work: ["¡Dale, Nico, no seas insecto!", "¡Supera tus propios límites!", "¡Kamehameha!", "El príncipe de los Saiyajin no se rinde.", "¡Resplandor Final!"],
      rest: ["Come una semilla Senzu.", "Apenas te estoy calentando, recupérate."],
      done: ["Eres un guerrero legendario."]
    },
    audio: { type: 'sawtooth', fx: 'ascend' }
  },
  starwars: {
    appTitle: "JEDI HIIT", fontName: "Orbitron",
    fontUrl: "https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap",
    colors: { prep: "#FFB000", work: "#00FF00", rest: "#00A2FF", done: "#B900FF" },
    quotes: {
      prep: ["Siente la Fuerza fluir.", "Concéntrate en el momento presente."],
      work: ["Hazlo, o no lo hagas. Pero no lo intentes.", "La Fuerza es intensa en ti.", "No conoces el poder del lado oscuro."],
      rest: ["Usa la Fuerza para recuperarte.", "La paciencia es el camino del Jedi."],
      done: ["La Fuerza estará contigo. Siempre."]
    },
    audio: { type: 'sine', fx: 'hum' }
  },
  rocky: {
    appTitle: "SEMENTAL", fontName: "Black Ops One",
    fontUrl: "https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap",
    colors: { prep: "#FFD700", work: "#E3000F", rest: "#FFFFFF", done: "#0038A8" },
    quotes: {
      prep: ["¡Sube al ring!", "Protege tu cara."],
      work: ["¡No se acaba hasta que suena la campana!", "¡Es tu vida, defiéndela!", "¡Golpea fuerte!", "Nadie golpea más duro que la vida."],
      rest: ["Respira. No hay dolor.", "El rincón es tu refugio, toma agua.", "Mickey te está viendo."],
      done: ["¡Lo lograste, campeón!"]
    },
    audio: { type: 'triangle', fx: 'bell' }
  },
  retro: {
    appTitle: "ARCADE", fontName: "Press Start 2P",
    fontUrl: "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
    colors: { prep: "#FFFF00", work: "#FF00FF", rest: "#00FFFF", done: "#00FF00" },
    quotes: {
      prep: ["INSERT COIN...", "GET READY!"],
      work: ["FINISH HIM!", "C-C-C-COMBO BREAKER!", "HIGH SCORE!", "PRESS START TO CONTINUE..."],
      rest: ["STAGE CLEAR - BONUS TIME", "PAUSE..."],
      done: ["YOU WIN! PERFECT!"]
    },
    audio: { type: 'square', fx: 'arpeggio' }
  },
  spartan: {
    appTitle: "AGOGÉ", fontName: "Cinzel",
    fontUrl: "https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap",
    colors: { prep: "#B8860B", work: "#8B0000", rest: "#556B2F", done: "#DAA520" },
    quotes: {
      prep: ["La disciplina es el origen de todo.", "El sudor ahorra sangre."],
      work: ["Vuelve con tu escudo, o sobre él.", "La adversidad es tu entrenamiento.", "Fuerza y honor.", "Esto es Esparta."],
      rest: ["Contempla en silencio.", "Un guerrero descansa para la próxima batalla."],
      done: ["Gloria eterna."]
    },
    audio: { type: 'sawtooth', fx: 'drum' }
  },
  matrix: {
    appTitle: "NEBULA", fontName: "VT323",
    fontUrl: "https://fonts.googleapis.com/css2?family=VT323&display=swap",
    colors: { prep: "#00FF41", work: "#00FF41", rest: "#008F11", done: "#FFFFFF" },
    quotes: {
      prep: ["Despierta, Neo.", "Sigue al conejo blanco."],
      work: ["No pienses que eres, sabes que eres.", "Esquiva esto.", "No hay cuchara."],
      rest: ["Cargando programa de recuperación...", "Desconectando simulador temporalmente."],
      done: ["Eres el elegido."]
    },
    audio: { type: 'square', fx: 'glitch' }
  },
  cyberpunk: {
    appTitle: "NEON CITY", fontName: "Rajdhani",
    fontUrl: "https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&display=swap",
    colors: { prep: "#FCEE09", work: "#FF003C", rest: "#00F0FF", done: "#00FF66" },
    quotes: {
      prep: ["Sincronizando implantes ciber.", "Batería al 100%."],
      work: ["¡Quema la ciudad, Samurai!", "Overclock activado.", "Sin piedad, choomba."],
      rest: ["Enfriando sistemas operativos...", "Rechazo de implantes estable."],
      done: ["Contrato completado, mercenario."]
    },
    audio: { type: 'sawtooth', fx: 'distort' }
  },
  samurai: {
    appTitle: "BUSHIDO", fontName: "Noto Serif JP",
    fontUrl: "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700;900&display=swap",
    colors: { prep: "#FFFFFF", work: "#B22222", rest: "#A9A9A9", done: "#4682B4" },
    quotes: {
      prep: ["Vacía tu mente.", "La espada es el alma."],
      work: ["Corta sin dudar.", "El camino de los mil kilómetros empieza con un paso.", "Firme como la montaña."],
      rest: ["Medita.", "El agua fluye y se adapta."],
      done: ["Armonía alcanzada."]
    },
    audio: { type: 'sine', fx: 'gong' }
  },
  doom: {
    appTitle: "SLAYER", fontName: "Creepster",
    fontUrl: "https://fonts.googleapis.com/css2?family=Creepster&display=swap",
    colors: { prep: "#FF4500", work: "#8B0000", rest: "#808080", done: "#FF0000" },
    quotes: {
      prep: ["Descendiendo al abismo...", "Carga tu escopeta."],
      work: ["RIP AND TEAR!", "¡Hasta que esté hecho!", "No tienen piedad, tú tampoco la tendrás."],
      rest: ["Recolectando munición...", "Respiro en el infierno."],
      done: ["Amenaza neutralizada."]
    },
    audio: { type: 'sawtooth', fx: 'heavy' }
  },
  hero: {
    appTitle: "COMIC HIIT", fontName: "Bangers",
    fontUrl: "https://fonts.googleapis.com/css2?family=Bangers&display=swap",
    colors: { prep: "#FFFF00", work: "#FF0000", rest: "#0000FF", done: "#00FF00" },
    quotes: {
      prep: ["¡Ponte la capa!", "¡La ciudad te necesita!"],
      work: ["¡BAM! ¡POW!", "¡Con un gran poder, viene una gran responsabilidad!", "¡Vengadores, reúnanse!"],
      rest: ["Regresa a la Baticueva.", "Toma aire, héroe."],
      done: ["¡Salvaste el día!"]
    },
    audio: { type: 'triangle', fx: 'ascend' }
  }
};

let currentUniverse = 'dbz';

function applyUniverse(key) {
  currentUniverse = key;
  const uni = MULTIVERSO[key];
  
  // Inyectar Fuente Dinámica
  if (!document.getElementById(`font-${key}`)) {
    const link = document.createElement('link');
    link.id = `font-${key}`; link.rel = 'stylesheet'; link.href = uni.fontUrl;
    document.head.appendChild(link);
  }
  
  document.documentElement.setAttribute('data-universo', key);
  document.documentElement.style.setProperty('--font-display', `"${uni.fontName}", system-ui`);
  
  // Asignar colores fijos
  document.documentElement.style.setProperty('--prep', uni.colors.prep);
  document.documentElement.style.setProperty('--rest', uni.colors.rest);
  document.documentElement.style.setProperty('--done', uni.colors.done);
  
  // Setup inicial de texto
  document.getElementById('appTitle').textContent = uni.appTitle;
  if(state === 'idle') updateDOMPhase({ phase: 'idle', round: 0 });
}

/* ============================================================
   MOTOR DE AUDIO REACTIVO Y WAKE LOCK
   ============================================================ */
let wakeLock = null;
async function requestWakeLock() { try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (e) {} }
function releaseWakeLock() { if (wakeLock) wakeLock.release().then(() => wakeLock = null); }

class AudioEngine {
  constructor() { this.ctx = null; }
  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }
  playTone(freq, duration, type, startTime) {
    if(!this.ctx) return;
    const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.5, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(startTime); osc.stop(startTime + duration + 0.1);
  }
  
  // Lógica de efectos de sonido basados en el Universo
  playPhaseTone(startTime) {
    if(!this.ctx) return;
    const uni = MULTIVERSO[currentUniverse].audio;
    if (uni.fx === 'ascend') {
      const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
      osc.type = uni.type; osc.frequency.setValueAtTime(150, startTime); osc.frequency.exponentialRampToValueAtTime(800, startTime + 0.4);
      gain.gain.setValueAtTime(0, startTime); gain.gain.linearRampToValueAtTime(0.4, startTime + 0.1); gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
      osc.connect(gain).connect(this.ctx.destination); osc.start(startTime); osc.stop(startTime + 0.6);
    } else if (uni.fx === 'hum') {
      this.playTone(100, 0.6, 'sine', startTime); // Lightsaber low hum
    } else if (uni.fx === 'arpeggio') {
      this.playTone(440, 0.1, 'square', startTime); this.playTone(554, 0.1, 'square', startTime+0.1); this.playTone(659, 0.2, 'square', startTime+0.2);
    } else {
      this.playTone(523.25, 0.4, uni.type, startTime); // Default
    }
  }
  
  beepShort(time) { 
    this.playTone(880, 0.1, MULTIVERSO[currentUniverse].audio.type, time); 
  }
}
const audio = new AudioEngine();

/* ============================================================
   LÓGICA DEL TEMPORIZADOR Y TRANSFORMACIONES Z
   ============================================================ */
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

// Carga Inicial
const savedConfig = localStorage.getItem('tabata_uni_cfg');
if(savedConfig) {
  const cfg = JSON.parse(savedConfig);
  CONFIG = cfg.timers || CONFIG;
  document.getElementById('inPrep').value = CONFIG.prep; document.getElementById('inWork').value = CONFIG.work;
  document.getElementById('inRest').value = CONFIG.rest; document.getElementById('inRounds').value = CONFIG.rounds;
  document.getElementById('inCycles').value = CONFIG.cycles;
  document.getElementById('themeSelector').value = cfg.theme || 'dbz';
  applyUniverse(cfg.theme || 'dbz');
} else { applyUniverse('dbz'); }

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

function getWorkColor(round) {
  // DBZ Transformation Logic
  if (currentUniverse === 'dbz') {
    const pct = round / CONFIG.rounds;
    if (pct <= 0.35) return { name: 'SUPER SAIYAJIN', hex: '#FFD700', ink: '#332B00' };
    if (pct <= 0.75) return { name: 'SSJ BLUE', hex: '#00BFFF', ink: '#002633' };
    return { name: 'ULTRA INSTINTO', hex: '#FFFFFF', ink: '#1A1A1A' };
  }
  // Standard Universe Work Color
  return { name: MULTIVERSO[currentUniverse].quotes.work[0] ? '¡ACCIÓN!' : 'COMBATE', hex: MULTIVERSO[currentUniverse].colors.work, ink: '#000' };
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
  const uni = MULTIVERSO[currentUniverse];
  
  if (seg.phase === 'work') {
    const trans = getWorkColor(seg.round);
    document.documentElement.style.setProperty('--work-dynamic', trans.hex);
    colorVar = '--work-dynamic'; inkVar = '--bg'; badgeText = (currentUniverse === 'dbz') ? trans.name : "ACCIÓN";
    triggerShake(); 
    document.documentElement.style.setProperty('--ring-glow-opacity', '1');
  } else {
    document.documentElement.style.setProperty('--ring-glow-opacity', '0');
    const meta = {
      idle: { l: 'LISTO', c: '--idle', i: '--ink' },
      prep: { l: 'PREPARACIÓN', c: '--prep', i: '--bg' },
      rest: { l: 'DESCANSO', c: '--rest', i: '--bg' },
      done: { l: 'COMPLETADO', c: '--done', i: '--bg' }
    };
    colorVar = meta[seg.phase].c; inkVar = meta[seg.phase].i; badgeText = meta[seg.phase].l;
  }

  document.documentElement.style.setProperty('--phase-color', `var(${colorVar})`);
  document.documentElement.style.setProperty('--phase-ink', `var(${inkVar})`);
  UI.badge.textContent = badgeText;
  
  if (seg.phase === 'done') UI.line.textContent = uni.quotes.done[0];
  else if (seg.phase === 'prep') UI.line.textContent = 'En sus marcas...';
  else if (seg.phase === 'idle') UI.line.textContent = 'Ajusta tu configuración';
  else UI.line.textContent = `Ronda ${seg.round} de ${CONFIG.rounds} (Ciclo ${seg.cycle}/${CONFIG.cycles})`;

  if(seg.phase !== 'idle' && seg.phase !== 'done') {
    const pool = uni.quotes[seg.phase] || uni.quotes.work;
    UI.motivation.textContent = pool[Math.floor(Math.random() * pool.length)];
  } else { UI.motivation.textContent = ""; }

  if (navigator.vibrate) {
    if(seg.phase === 'work') navigator.vibrate([100, 50, 100, 50, 300]);
    else if(seg.phase === 'rest') navigator.vibrate(100);
  }
}

function tick() {
  if (state !== 'running') return;
  const now = performance.now(); let remaining = (phaseEndTime - now) / 1000;
  const currentSeg = sequence[seqIndex];

  if (remaining <= 0) {
    seqIndex++;
    if (seqIndex >= sequence.length) { stopEngine(true); return; }
    
    const nextSeg = sequence[seqIndex];
    phaseEndTime = now + (nextSeg.duration * 1000);
    remaining = nextSeg.duration; lastBeepedSecond = -1;
    updateDOMPhase(nextSeg); startRingAnimation(nextSeg.duration, remaining);
    
    if(nextSeg.phase === 'work') audio.playPhaseTone(audio.ctx.currentTime);
    else audio.playTone(523.25, 0.4, MULTIVERSO[currentUniverse].audio.type, audio.ctx.currentTime);
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
    buildSequence(); seqIndex = 0; updateDOMPhase(sequence[0]);
    phaseEndTime = performance.now() + (sequence[0].duration * 1000);
    startRingAnimation(sequence[0].duration, sequence[0].duration);
    state = 'running'; UI.app.classList.add('deep-focus'); setControlsEnabled(true);
    UI.btnPlay.innerHTML = '⏸ Pausa'; uiInterval = setInterval(tick, 200); requestWakeLock();
  } else if (state === 'running') {
    state = 'paused'; clearInterval(uiInterval); remainingAtPause = phaseEndTime - performance.now();
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
  document.documentElement.style.setProperty('--ring-glow-opacity', '0');
  
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

  if (direction === 'next' && seqIndex < sequence.length - 1) seqIndex++; 
  else if (direction === 'prev' && seqIndex > 0) seqIndex--; 
  else return;

  const nextSeg = sequence[seqIndex];
  remainingAtPause = nextSeg.duration * 1000; phaseEndTime = now + remainingAtPause;
  lastBeepedSecond = -1; updateDOMPhase(nextSeg);
  
  if (state === 'running') {
    startRingAnimation(nextSeg.duration, nextSeg.duration);
    if(nextSeg.phase === 'work') audio.playPhaseTone(audio.ctx.currentTime);
    else audio.playTone(523.25, 0.4, MULTIVERSO[currentUniverse].audio.type, audio.ctx.currentTime);
  } else {
    pauseRingAnimation(); UI.ring.style.strokeDashoffset = 0;
    UI.time.textContent = `${String(Math.floor(nextSeg.duration / 60)).padStart(2, '0')}:${String(nextSeg.duration % 60).padStart(2, '0')}`;
  }
}

/* Eventos */
UI.btnPlay.addEventListener('click', togglePlay);
UI.btnStop.addEventListener('click', () => { if(confirm("¿Detener sesión?")) stopEngine(false); });
UI.btnPrev.addEventListener('click', () => skipPhase('prev'));
UI.btnNext.addEventListener('click', () => skipPhase('next'));
UI.btn10.addEventListener('click', () => {
  if (state === 'idle') return; sequence[seqIndex].duration += 10;
  if (state === 'running') { phaseEndTime += 10000; startRingAnimation(sequence[seqIndex].duration, (phaseEndTime - performance.now()) / 1000); } 
  else { remainingAtPause += 10000; tick(); }
});

const mSettings = document.getElementById('modalSettings');
document.getElementById('btnSettings').addEventListener('click', () => mSettings.classList.add('active'));

document.getElementById('themeSelector').addEventListener('change', (e) => {
  applyUniverse(e.target.value);
});

document.getElementById('btnSaveSettings').addEventListener('click', () => {
  CONFIG = {
    prep: parseInt(document.getElementById('inPrep').value)||0, work: parseInt(document.getElementById('inWork').value)||1,
    rest: parseInt(document.getElementById('inRest').value)||0, rounds: parseInt(document.getElementById('inRounds').value)||1,
    cycles: parseInt(document.getElementById('inCycles').value)||1
  };
  localStorage.setItem('tabata_uni_cfg', JSON.stringify({ theme: currentUniverse, timers: CONFIG }));
  mSettings.classList.remove('active');
  if(state === 'idle') stopEngine(false); 
});

const mStats = document.getElementById('modalStats');
document.getElementById('btnStats').addEventListener('click', () => mStats.classList.add('active'));
document.getElementById('btnCloseStats').addEventListener('click', () => mStats.classList.remove('active'));

window.addEventListener('keydown', e => {
  if (e.code === 'Space' && !mSettings.classList.contains('active')) { e.preventDefault(); togglePlay(); }
  if (e.code === 'ArrowRight' && state !== 'idle') skipPhase('next');
  if (e.code === 'ArrowLeft' && state !== 'idle') skipPhase('prev');
});

stopEngine(false);
