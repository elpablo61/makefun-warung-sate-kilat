// Warung Sate Kilat — input: mouse + keyboard, satu job: ubah klik/tombol jadi aksi.
import { zones } from './render.js';
import { placeSkewer, liftSkewer } from './grill.js';
import { addSide, clearPlate } from './plate.js';
import { servePlate } from './orders.js';
import { resetState, toast } from './state.js';

function inside(p, r) {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}

export function bindInput(canvas, s, audio) {
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const p = {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
    handleClick(s, p, audio);
  });

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    handleKey(s, e.key.toLowerCase(), audio);
  });
}

export function handleClick(s, p, audio) {
  const z = zones();
  if (inside(p, z.muteBtn)) { s.muted = !s.muted; return; }

  if (s.screen === 'title') {
    if (inside(p, z.startBtn)) { s.screen = 'playing'; audio.resume(); audio.sizzle(); }
    return;
  }
  if (s.screen === 'won' || s.screen === 'lost') {
    if (inside(p, z.restartBtn)) { resetState(s); audio.resume(); }
    return;
  }

  // pilih pesanan dari papan
  for (let i = 0; i < z.orderCards.length; i++) {
    if (inside(p, z.orderCards[i]) && s.orders[i]) {
      s.selectedOrder = i;
      audio.click();
      return;
    }
  }
  // sate mentah -> grill
  if (inside(p, z.rawPile)) {
    if (placeSkewer(s)) audio.sizzle();
    return;
  }
  // grill: angkat sate
  for (let i = 0; i < z.grillSlots.length; i++) {
    if (inside(p, z.grillSlots[i])) {
      if (liftSkewer(s, i)) audio.pickup();
      return;
    }
  }
  // sisi
  for (const b of z.sideBtns) {
    if (inside(p, b)) {
      if (addSide(s, b.id)) audio.click();
      return;
    }
  }
  if (inside(p, z.serveBtn)) {
    if (servePlate(s)) audio.serve();
    else audio.error();
    return;
  }
  if (inside(p, z.clearBtn)) { clearPlate(s); audio.click(); }
}

export function handleKey(s, key, audio) {
  if (key === 'm') { s.muted = !s.muted; return; }
  if (s.screen === 'title' && (key === 'enter' || key === ' ')) {
    s.screen = 'playing'; audio.resume(); audio.sizzle(); return;
  }
  if ((s.screen === 'won' || s.screen === 'lost') && key === 'r') {
    resetState(s); audio.resume(); return;
  }
  if (s.screen !== 'playing') return;
  if (key === 'r') { resetState(s); toast(s, 'Shift diulang dari awal.'); return; }
  if (key >= '1' && key <= '6') {
    if (liftSkewer(s, Number(key) - 1)) audio.pickup();
    return;
  }
  if (key === 'q' || key === 'w' || key === 'e') {
    const id = key === 'q' ? 'lontong' : key === 'w' ? 'bumbu' : 'bawang';
    if (addSide(s, id)) audio.click();
    return;
  }
  if (key === ' ') {
    if (servePlate(s)) audio.serve();
    else audio.error();
    return;
  }
  if (key === 'c') { clearPlate(s); audio.click(); }
  if (key === 'arrowdown' || key === 'arrowup') {
    const d = key === 'arrowdown' ? 1 : -1;
    if (s.orders.length) {
      s.selectedOrder = (s.selectedOrder + d + s.orders.length) % s.orders.length;
      audio.click();
    }
  }
}
