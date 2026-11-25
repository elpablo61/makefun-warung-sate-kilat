// Warung Sate Kilat — orders: spawn, tick patience, serve, score.
import { TUNE, CUSTOMERS, SIDES } from './config.js';
import { toast } from './state.js';

export function spawnOrder(s) {
  if (s.orders.length >= TUNE.maxOrders) return;
  const skewers = 2 + Math.floor(Math.random() * 3); // 2-4 tusuk
  const sideCount = 1 + Math.floor(Math.random() * 2); // 1-2 sisi
  const shuffled = [...SIDES].sort(() => Math.random() - 0.5);
  const sides = shuffled.slice(0, sideCount).map((x) => x.id);
  const patience = TUNE.orderPatience + Math.random() * 10;
  s.orders.push({
    id: s.nextOrderId++,
    customer: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
    skewers,
    sides,
    patience,
    maxPatience: patience,
    state: 'waiting', // waiting | served | left
  });
  if (s.selectedOrder >= s.orders.length) s.selectedOrder = 0;
}

export function tickOrders(s, dt) {
  s.spawnTimer -= dt;
  if (s.spawnTimer <= 0) {
    spawnOrder(s);
    // rush: pesanan makin cepat seiring waktu
    s.spawnTimer = Math.max(6, TUNE.orderSpawnEvery - s.time * 0.04);
  }
  for (const o of s.orders) {
    o.patience -= dt;
    if (o.patience <= 0 && o.state === 'waiting') {
      o.state = 'left';
      s.lives -= 1;
      s.lost += 1;
      s.combo = 0;
      toast(s, `${o.customer} pergi! Pelanggan marah.`);
    }
  }
  // pelanggan yang pergi tinggal 1.5 detik di papan (tanda silang) lalu hilang
  s.orders = s.orders.filter((o) => !(o.state === 'left' && o.patience <= -1.5));
  if (s.selectedOrder >= s.orders.length) s.selectedOrder = Math.max(0, s.orders.length - 1);
}

// Apakah piring saat ini cocok dengan pesanan yang dipilih?
export function plateMatchesOrder(s, order) {
  if (!order) return { ok: false, reason: 'Tidak ada pesanan.' };
  if (s.plate.skewers !== order.skewers) {
    return { ok: false, reason: `Butuh ${order.skewers} tusuk sate, piring ada ${s.plate.skewers}.` };
  }
  for (const side of order.sides) {
    if (!s.plate.sides.has(side)) return { ok: false, reason: `Kurang ${side}.` };
  }
  return { ok: true, reason: '' };
}

export function servePlate(s) {
  const order = s.orders[s.selectedOrder];
  const check = plateMatchesOrder(s, order);
  if (!check.ok) {
    s.score = Math.max(0, s.score - TUNE.wrongServePenalty);
    s.combo = 0;
    toast(s, `Salah sajian! ${check.reason} (-${TUNE.wrongServePenalty})`);
    return false;
  }
  const timeBonus = Math.round((order.patience / order.maxPatience) * TUNE.timeBonusMax);
  const base = TUNE.scoreServeBase
    + order.skewers * TUNE.scorePerSkewer
    + order.sides.length * TUNE.scorePerSide
    + timeBonus;
  const mult = 1 + s.combo * TUNE.comboStep;
  const gained = Math.round(base * mult);
  s.score += gained;
  s.combo += 1;
  s.bestCombo = Math.max(s.bestCombo, s.combo);
  s.served += 1;
  order.state = 'served';
  s.orders = s.orders.filter((o) => o.state !== 'served');
  s.plate = { skewers: 0, sides: new Set() };
  if (s.selectedOrder >= s.orders.length) s.selectedOrder = Math.max(0, s.orders.length - 1);
  toast(s, `Sajian ${order.customer}: +${gained} poin!${s.combo > 1 ? ` Kombo x${s.combo}!` : ''}`);
  s.stars.push({ x: 640, y: 300, t: 0, n: 12 });
  return true;
}
