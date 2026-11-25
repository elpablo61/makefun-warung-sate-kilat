// Warung Sate Kilat — render: semua gambar canvas 2D, sprite digambar kode.
// Tanpa aset eksternal, tanpa anti-aliasing pada bentuk pixel (fillRect tegas).
import { PALETTE as P, TUNE, SIDES } from './config.js';
import { skewerStage } from './grill.js';

// Zona klik (dipakai input.js juga) — koordinat canvas 1280x720.
export function zones() {
  const grillSlots = [];
  for (let i = 0; i < TUNE.grillSlots; i++) {
    grillSlots.push({ x: 120 + i * 105, y: 330, w: 88, h: 110 });
  }
  const sideBtns = SIDES.map((s, i) => ({ id: s.id, x: 120 + i * 150, y: 560, w: 132, h: 64 }));
  return {
    grillSlots,
    rawPile: { x: 120, y: 480, w: 200, h: 60 },
    sideBtns,
    serveBtn: { x: 900, y: 560, w: 260, h: 64 },
    clearBtn: { x: 900, y: 480, w: 260, h: 56 },
    orderCards: [0, 1, 2, 3].map((i) => ({ x: 60 + i * 305, y: 88, w: 285, h: 100 })),
    startBtn: { x: 490, y: 520, w: 300, h: 64 },
    restartBtn: { x: 490, y: 520, w: 300, h: 64 },
    muteBtn: { x: 1210, y: 14, w: 56, h: 36 },
  };
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, str, x, y, size, color, align = 'left', bold = true) {
  ctx.fillStyle = color;
  ctx.font = `${bold ? 'bold' : ''} ${size}px "Trebuchet MS", Verdana, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

// Satu tusuk sate: lidi + 3 potong daging, warna ikut tahap masak.
export function drawSkewer(ctx, x, y, stage, t) {
  const meat = { raw: '#e07856', perfect: '#b4622a', burnt: '#3a2418', ash: '#241a14' }[stage];
  const glow = stage === 'perfect' ? P.gold : null;
  ctx.fillStyle = '#d8c49a';
  ctx.fillRect(x - 4, y + 58, 8, 34); // lidi
  for (let k = 0; k < 3; k++) {
    const my = y + k * 20;
    ctx.fillStyle = meat;
    ctx.fillRect(x - 14, my, 28, 16);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(x - 14, my + 12, 28, 4);
    if (glow && k === 1) {
      ctx.strokeStyle = glow;
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 16, my - 2, 32, 20);
    }
  }
  if (stage === 'perfect') {
    // panah "angkat sekarang!" berdenyut
    const pulse = 0.6 + 0.4 * Math.sin(t * 6);
    ctx.fillStyle = `rgba(242,193,78,${pulse.toFixed(2)})`;
    ctx.beginPath();
    ctx.moveTo(x, y - 26);
    ctx.lineTo(x - 8, y - 38);
    ctx.lineTo(x + 8, y - 38);
    ctx.closePath();
    ctx.fill();
  }
  if (stage === 'burnt' || stage === 'ash') {
    text(ctx, 'GOSONG!', x, y - 24, 13, P.chili, 'center');
  }
}

function drawFlame(ctx, x, y, t, big) {
  const h = (big ? 26 : 16) + Math.sin(t * 9 + x) * 4;
  ctx.fillStyle = P.ember;
  ctx.beginPath();
  ctx.moveTo(x, y - h);
  ctx.quadraticCurveTo(x + 12, y - h * 0.4, x + 6, y);
  ctx.quadraticCurveTo(x - 6, y - h * 0.3, x - 8, y);
  ctx.quadraticCurveTo(x - 12, y - h * 0.5, x, y - h);
  ctx.fill();
  ctx.fillStyle = P.amber;
  ctx.beginPath();
  ctx.moveTo(x, y - h * 0.6);
  ctx.quadraticCurveTo(x + 6, y - h * 0.2, x + 3, y);
  ctx.quadraticCurveTo(x - 3, y - h * 0.15, x - 4, y);
  ctx.quadraticCurveTo(x - 6, y - h * 0.3, x, y - h * 0.6);
  ctx.fill();
}

function drawOrderCard(ctx, o, z, selected, t) {
  const urgent = o.patience < 12;
  ctx.fillStyle = selected ? '#3a2a1c' : P.charcoalSoft;
  rr(ctx, z.x, z.y, z.w, z.h, 10);
  ctx.fill();
  ctx.strokeStyle = selected ? P.gold : (urgent ? P.chili : P.wood);
  ctx.lineWidth = selected ? 3 : 2;
  ctx.stroke();
  text(ctx, o.customer, z.x + 14, z.y + 20, 17, P.cream);
  text(ctx, `${o.skewers} tusuk sate`, z.x + 14, z.y + 46, 15, P.creamDim, 'left', false);
  text(ctx, o.sides.join(' + '), z.x + 14, z.y + 68, 13, P.lime, 'left', false);
  // timer bar
  const frac = Math.max(0, o.patience / o.maxPatience);
  ctx.fillStyle = '#120c0a';
  rr(ctx, z.x + 14, z.y + 80, z.w - 28, 12, 6);
  ctx.fill();
  ctx.fillStyle = urgent ? P.chili : (frac > 0.5 ? P.lime : P.amber);
  if (frac > 0) { rr(ctx, z.x + 14, z.y + 80, (z.w - 28) * frac, 12, 6); ctx.fill(); }
  text(ctx, `${Math.ceil(o.patience)} dtk`, z.x + z.w - 14, z.y + 20, 14, urgent ? P.chili : P.creamDim, 'right');
  if (o.state === 'left') {
    ctx.fillStyle = 'rgba(26,18,16,0.75)';
    rr(ctx, z.x, z.y, z.w, z.h, 10);
    ctx.fill();
    text(ctx, 'PERGI!', z.x + z.w / 2, z.y + z.h / 2, 24, P.chili, 'center');
  }
}

export function render(ctx, s, dt) {
  const W = TUNE.canvasW, H = TUNE.canvasH;
  const t = s.time;
  // langit malam + atap warung
  ctx.fillStyle = P.charcoal;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#241812';
  for (let i = 0; i < 40; i++) {
    const sx = (i * 173) % W, sy = (i * 97) % 60;
    ctx.fillStyle = i % 3 ? '#f5e6c8' : '#ff9a3c';
    ctx.globalAlpha = 0.25 + (i % 4) * 0.15;
    ctx.fillRect(sx, sy, 2, 2);
  }
  ctx.globalAlpha = 1;

  // ===== header =====
  ctx.fillStyle = P.woodDark;
  ctx.fillRect(0, 0, W, 64);
  text(ctx, 'WARUNG SATE KILAT', 20, 32, 26, P.amber);
  text(ctx, `SKOR ${s.score}`, 330, 32, 22, P.gold);
  text(ctx, s.combo > 1 ? `KOMBO x${s.combo}` : '', 520, 32, 20, P.lime);
  for (let i = 0; i < TUNE.lives; i++) {
    ctx.fillStyle = i < s.lives ? P.chili : '#4a3428';
    ctx.beginPath();
    ctx.arc(700 + i * 34, 32, 11, 0, Math.PI * 2);
    ctx.fill();
    text(ctx, '♥', 700 + i * 34, 33, 13, P.cream, 'center');
  }
  text(ctx, `Sajian ${s.served}/${TUNE.shiftTargetOrders}  •  Target ${TUNE.shiftTargetScore}`, 830, 32, 16, P.creamDim, 'left', false);
  text(ctx, s.muted ? 'SUARA: MATI (M)' : 'SUARA: HIDUP (M)', 1180, 32, 13, P.creamDim, 'right', false);

  if (s.screen === 'title') { renderTitle(ctx, s); return; }
  if (s.screen === 'won' || s.screen === 'lost') { renderEnd(ctx, s); return; }

  const z = zones();

  // ===== papan order =====
  text(ctx, 'PAPAN PESANAN — klik kartu untuk memilih pesanan', 60, 76, 14, P.creamDim, 'left', false);
  s.orders.forEach((o, i) => {
    if (i < 4) drawOrderCard(ctx, o, z.orderCards[i], i === s.selectedOrder, t);
  });
  if (s.orders.length === 0) {
    text(ctx, 'Belum ada pesanan… pelanggan segera datang!', 60, 130, 16, P.creamDim, 'left', false);
  }

  // ===== grill =====
  text(ctx, 'PANGGANGAN ARANG — klik sate mentah untuk membakar, klik sate matang untuk mengangkat', 60, 210, 14, P.creamDim, 'left', false);
  ctx.fillStyle = '#0f0a08';
  rr(ctx, 100, 300, 620, 150, 12);
  ctx.fill();
  ctx.fillStyle = P.wood;
  rr(ctx, 92, 292, 636, 166, 12);
  ctx.stroke();
  // bara
  for (let i = 0; i < 14; i++) {
    const bx = 130 + i * 42 + ((i % 2) * 12);
    drawFlame(ctx, bx, 428, t + i, i % 3 === 0);
  }
  s.grill.forEach((g, i) => {
    const slot = z.grillSlots[i];
    if (g) drawSkewer(ctx, slot.x + slot.w / 2, slot.y + 6, g.state, t);
    else {
      ctx.strokeStyle = '#4a3428';
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(slot.x, slot.y, slot.w, slot.h);
      ctx.setLineDash([]);
      text(ctx, 'kosong', slot.x + slot.w / 2, slot.y + slot.h / 2, 13, P.smoke, 'center', false);
    }
    text(ctx, `${i + 1}`, slot.x + 8, slot.y + 12, 12, P.creamDim, 'left', false);
  });
  // asap
  for (const p of s.smoke) {
    ctx.globalAlpha = Math.max(0, 0.5 - p.t * 0.3);
    ctx.fillStyle = P.smoke;
    ctx.beginPath();
    ctx.arc(p.x, p.y - p.t * 60, (p.big ? 14 : 9) + p.t * 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // ===== counter bahan =====
  text(ctx, 'COUNTER BAHAN — klik untuk menambah ke piring / grill', 60, 470, 14, P.creamDim, 'left', false);
  ctx.fillStyle = P.wood;
  rr(ctx, z.rawPile.x, z.rawPile.y, z.rawPile.w, z.rawPile.h, 10);
  ctx.fill();
  // dua tusuk mentah mini, muat di dalam tombol (daging + lidi pendek)
  for (const ox of [36, 66]) {
    for (let k = 0; k < 3; k++) {
      ctx.fillStyle = '#e07856';
      ctx.fillRect(z.rawPile.x + ox - 12, z.rawPile.y + 6 + k * 13, 24, 11);
    }
    ctx.fillStyle = '#d8c49a';
    ctx.fillRect(z.rawPile.x + ox - 3, z.rawPile.y + 46, 6, 10);
  }
  text(ctx, 'Sate Mentah', z.rawPile.x + 110, z.rawPile.y + 30, 15, P.cream);
  z.sideBtns.forEach((b, i) => {
    const side = SIDES[i];
    const on = s.plate.sides.has(side.id);
    ctx.fillStyle = on ? P.lime : P.charcoalSoft;
    rr(ctx, b.x, b.y, b.w, b.h, 10);
    ctx.fill();
    ctx.strokeStyle = on ? P.lime : P.wood;
    ctx.lineWidth = 2;
    ctx.stroke();
    text(ctx, side.name, b.x + b.w / 2, b.y + 22, 14, on ? '#1a1210' : P.cream, 'center');
    text(ctx, `[${side.key}] ${on ? '✓' : ''}`, b.x + b.w / 2, b.y + 44, 13, on ? '#1a1210' : P.creamDim, 'center', false);
  });

  // ===== piring + sajikan =====
  text(ctx, 'PIRING — rakit sesuai pesanan yang dipilih, lalu SAJIKAN', 860, 210, 14, P.creamDim, 'left', false);
  ctx.fillStyle = P.cream;
  ctx.beginPath();
  ctx.ellipse(1020, 360, 150, 105, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = P.gold;
  ctx.lineWidth = 4;
  ctx.stroke();
  // isi piring: sate di tengah, sisi berbaris di bawahnya (nama di bawah dot)
  for (let k = 0; k < s.plate.skewers; k++) {
    drawSkewer(ctx, 940 + k * 55, 290, 'perfect', t);
  }
  const sideIds = [...s.plate.sides];
  sideIds.forEach((id, i) => {
    const side = SIDES.find((x) => x.id === id);
    const cx = 1020 + (i - (sideIds.length - 1) / 2) * 95;
    ctx.fillStyle = side.color;
    ctx.beginPath();
    ctx.arc(cx, 420, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = P.woodDark;
    ctx.lineWidth = 2;
    ctx.stroke();
    text(ctx, side.name, cx, 446, 11, P.woodDark, 'center');
  });
  if (s.plate.skewers === 0 && s.plate.sides.size === 0) {
    text(ctx, 'Piring kosong', 1020, 360, 16, P.smoke, 'center', false);
  }
  const order = s.orders[s.selectedOrder];
  text(ctx, order ? `Dituju: ${order.customer} — ${order.skewers} tusuk + ${order.sides.join(', ')}` : 'Tidak ada pesanan dipilih', 1020, 250, 14, P.creamDim, 'center', false);
  // tombol sajikan
  ctx.fillStyle = P.amber;
  rr(ctx, z.serveBtn.x, z.serveBtn.y, z.serveBtn.w, z.serveBtn.h, 12);
  ctx.fill();
  text(ctx, 'SAJIKAN!  [Spasi]', z.serveBtn.x + z.serveBtn.w / 2, z.serveBtn.y + 32, 20, '#1a1210', 'center');
  ctx.fillStyle = P.charcoalSoft;
  rr(ctx, z.clearBtn.x, z.clearBtn.y, z.clearBtn.w, z.clearBtn.h, 10);
  ctx.fill();
  text(ctx, 'Kosongkan Piring  [C]', z.clearBtn.x + z.clearBtn.w / 2, z.clearBtn.y + 28, 15, P.cream, 'center');

  // ===== bintang skor =====
  for (const st of s.stars) {
    ctx.globalAlpha = Math.max(0, 1 - st.t);
    ctx.fillStyle = P.gold;
    for (let k = 0; k < st.n; k++) {
      const a = (k / st.n) * Math.PI * 2;
      ctx.fillRect(st.x + Math.cos(a) * st.t * 90 - 3, st.y + Math.sin(a) * st.t * 90 - 3, 6, 6);
    }
  }
  ctx.globalAlpha = 1;

  // ===== toast + bantuan =====
  if (s.messageT > 0) {
    ctx.fillStyle = 'rgba(26,18,16,0.9)';
    const w = Math.min(700, 24 + s.message.length * 9);
    rr(ctx, W / 2 - w / 2, 640, w, 34, 8);
    ctx.fill();
    text(ctx, s.message, W / 2, 657, 15, P.gold, 'center');
  }
  text(ctx, 'Klik: taruh sate (1–6 angkat) • Q/W/E sisi • Spasi sajikan • R restart • M suara', 60, 700, 13, P.creamDim, 'left', false);
}

function renderTitle(ctx, s) {
  const W = TUNE.canvasW;
  ctx.fillStyle = 'rgba(26,18,16,0.85)';
  ctx.fillRect(0, 64, W, 656);
  text(ctx, 'WARUNG SATE KILAT', W / 2, 180, 54, P.amber, 'center');
  text(ctx, 'Warung sate malam hari. Pesanan datang, arang menyala, pelanggan lapar.', W / 2, 240, 18, P.cream, 'center', false);
  text(ctx, 'Bakar sate sampai matang (jangan gosong!), rakit piring sesuai pesanan, sajikan cepat.', W / 2, 272, 18, P.cream, 'center', false);
  text(ctx, 'MENANG: skor 1.500 atau 8 pesanan tersaji  •  KALAH: 3 pelanggan pergi', W / 2, 310, 18, P.lime, 'center', false);
  text(ctx, 'Cara main:', W / 2, 360, 20, P.gold, 'center');
  text(ctx, '1. Klik Sate Mentah → masuk grill    2. Klik sate matang → ke piring', W / 2, 394, 16, P.cream, 'center', false);
  text(ctx, '3. Klik Q / W / E untuk lontong, bumbu, bawang    4. Spasi untuk SAJIKAN', W / 2, 424, 16, P.cream, 'center', false);
  text(ctx, 'Keyboard: 1–6 angkat sate dari grill • R restart • M suara', W / 2, 454, 16, P.creamDim, 'center', false);
  const z = zones();
  ctx.fillStyle = P.amber;
  rr(ctx, z.startBtn.x, z.startBtn.y, z.startBtn.w, z.startBtn.h, 12);
  ctx.fill();
  text(ctx, 'MULAI SHIFT  [Enter]', z.startBtn.x + 150, z.startBtn.y + 32, 22, '#1a1210', 'center');
  text(ctx, 'Sate ayam, bumbu kacang, dan asap arang — semua digambar dari kode.', W / 2, 620, 13, P.smoke, 'center', false);
}

function renderEnd(ctx, s) {
  const W = TUNE.canvasW;
  ctx.fillStyle = 'rgba(26,18,16,0.88)';
  ctx.fillRect(0, 64, W, 656);
  const won = s.screen === 'won';
  text(ctx, won ? 'SHIFT SELESAI — WARUNG LARIS!' : 'WARUNG TUTUP — PELANGGAN KABUR', W / 2, 220, 40, won ? P.gold : P.chili, 'center');
  text(ctx, `Skor akhir: ${s.score}   •   Pesanan tersaji: ${s.served}   •   Kombo terbaik: x${s.bestCombo}`, W / 2, 300, 20, P.cream, 'center', false);
  text(ctx, won ? 'Semua pelanggan pulang kenyang. Besok buka lagi, lebih cepat!' : 'Tiga pelanggan pergi dengan perut kosong. Coba lagi, lebih sigap!', W / 2, 340, 16, P.creamDim, 'center', false);
  const z = zones();
  ctx.fillStyle = P.amber;
  rr(ctx, z.restartBtn.x, z.restartBtn.y, z.restartBtn.w, z.restartBtn.h, 12);
  ctx.fill();
  text(ctx, 'MAIN LAGI  [R]', z.restartBtn.x + 150, z.restartBtn.y + 32, 22, '#1a1210', 'center');
}
