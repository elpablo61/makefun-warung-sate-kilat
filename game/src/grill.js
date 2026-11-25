// Warung Sate Kilat — grill: sate mentah -> matang -> gosong (timing).
import { TUNE } from './config.js';
import { toast } from './state.js';

// Taruh satu tusuk mentah di slot kosong pertama. false = grill penuh.
export function placeSkewer(s) {
  const i = s.grill.findIndex((g) => g === null);
  if (i === -1) { toast(s, 'Grill penuh! Angkat dulu yang matang.'); return false; }
  s.grill[i] = { t: 0, state: 'raw' };
  return true;
}

// Status sate dari waktu bakarnya.
export function skewerStage(g) {
  if (!g) return 'empty';
  if (g.t < TUNE.cookPerfectAt) return 'raw';
  if (g.t < TUNE.cookBurntAt) return 'perfect';
  if (g.t < TUNE.cookMax) return 'burnt';
  return 'ash';
}

export function tickGrill(s, dt) {
  for (const g of s.grill) {
    if (!g) continue;
    g.t += dt;
    g.state = skewerStage(g);
  }
  // asap dari sate yang hampir gosong
  s.sizzle += dt;
  if (s.sizzle > 0.25) {
    s.sizzle = 0;
    for (let i = 0; i < s.grill.length; i++) {
      const g = s.grill[i];
      if (g && (g.state === 'burnt' || g.state === 'ash')) {
        s.smoke.push({ x: 180 + i * 90, y: 400, t: 0, big: g.state === 'ash' });
      }
    }
  }
  s.smoke = s.smoke.filter((p) => p.t < 1.6);
  for (const p of s.smoke) p.t += dt;
}

// Angkat sate dari slot i ke piring. Matang = masuk piring, gosong = buang + denda.
export function liftSkewer(s, i) {
  const g = s.grill[i];
  if (!g) return false;
  if (g.state === 'raw') {
    toast(s, 'Masih mentah! Tunggu sampai cokelat keemasan.');
    return false;
  }
  if (g.state === 'burnt' || g.state === 'ash') {
    s.grill[i] = null;
    s.score = Math.max(0, s.score - TUNE.burntPenalty);
    s.combo = 0;
    toast(s, `Gosong! Dibuang. (-${TUNE.burntPenalty})`);
    return false;
  }
  s.grill[i] = null;
  s.plate.skewers += 1;
  return true;
}
