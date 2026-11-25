// Warung Sate Kilat — main: game loop + wiring modul. Satu file, satu tugas: jalan.
import { TUNE } from './config.js';
import { createState, toast } from './state.js';
import { spawnOrder, tickOrders } from './orders.js';
import { tickGrill } from './grill.js';
import { render } from './render.js';
import { bindInput } from './input.js';
import { createAudio } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const s = createState();
const audio = createAudio(s);

bindInput(canvas, s, audio);

// Debug / playtest hook: ?demo=1 langsung masuk permainan dengan 2 pesanan.
const params = new URLSearchParams(location.search);
if (params.get('demo') === '1') {
  s.screen = 'playing';
  spawnOrder(s);
  spawnOrder(s);
}

// Staging untuk screenshot maker: ?shot=cover|grill|rush menata state awal
// yang sama seperti permainan nyata (pesanan, grill, piring, skor) lalu game
// berjalan normal dari sana. Bukan gambar tempelan — semua dirender game.
function stageShot(kind) {
  s.screen = 'playing';
  s.time = kind === 'rush' ? 240 : 60;
  if (kind === 'cover') {
    spawnOrder(s); spawnOrder(s); spawnOrder(s);
    s.orders[0].patience = 38; s.orders[1].patience = 30; s.orders[2].patience = 44;
    s.grill[0] = { t: 6.5, state: 'perfect' };
    s.grill[1] = { t: 3.0, state: 'raw' };
    s.grill[2] = { t: 7.2, state: 'perfect' };
    s.plate.skewers = 2;
    s.plate.sides.add('lontong');
    s.plate.sides.add('bumbu');
    s.score = 320;
  } else if (kind === 'grill') {
    spawnOrder(s); spawnOrder(s);
    s.grill[0] = { t: 2.0, state: 'raw' };
    s.grill[1] = { t: 5.5, state: 'perfect' };
    s.grill[2] = { t: 8.0, state: 'perfect' };
    s.grill[3] = { t: 9.6, state: 'burnt' };
    s.grill[4] = { t: 4.0, state: 'raw' };
    s.plate.skewers = 1;
    s.score = 180;
  } else if (kind === 'rush') {
    spawnOrder(s); spawnOrder(s); spawnOrder(s); spawnOrder(s);
    s.orders.forEach((o, i) => { o.patience = [8, 14, 22, 35][i]; });
    s.grill[0] = { t: 6.0, state: 'perfect' };
    s.grill[1] = { t: 6.8, state: 'perfect' };
    s.grill[2] = { t: 3.5, state: 'raw' };
    s.grill[3] = { t: 9.2, state: 'burnt' };
    s.plate.skewers = 3;
    s.plate.sides.add('lontong');
    s.plate.sides.add('bumbu');
    s.plate.sides.add('bawang');
    s.score = 1240;
    s.combo = 4;
    s.bestCombo = 4;
    s.served = 6;
  }
}
if (params.get('shot')) stageShot(params.get('shot'));

let last = performance.now();
let endPlayed = false;

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  if (s.screen === 'playing') {
    s.time += dt;
    if (s.messageT > 0) s.messageT -= dt;
    tickOrders(s, dt);
    tickGrill(s, dt);
    for (const st of s.stars) st.t += dt * 1.4;
    s.stars = s.stars.filter((st) => st.t < 1);

    // menang / kalah
    if (s.score >= TUNE.shiftTargetScore || s.served >= TUNE.shiftTargetOrders) {
      s.screen = 'won';
    } else if (s.lives <= 0) {
      s.screen = 'lost';
    }
    if ((s.screen === 'won' || s.screen === 'lost') && !endPlayed) {
      endPlayed = true;
      if (s.screen === 'won') audio.win(); else audio.lose();
    }
    if (s.screen === 'playing') endPlayed = false;
  }

  render(ctx, s, dt);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

// Ekspos state untuk playtest otomatis (headless): window.__sate = state.
window.__sate = s;
window.__sateToast = (m) => toast(s, m);
