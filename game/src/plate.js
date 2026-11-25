// Warung Sate Kilat — plate: rakit piring (sate + lontong + bumbu + bawang).
import { SIDES } from './config.js';
import { toast } from './state.js';

// Tambah satu sisi ke piring (sekali per jenis). false = sudah ada / tidak dikenal.
export function addSide(s, sideId) {
  const side = SIDES.find((x) => x.id === sideId);
  if (!side) return false;
  if (s.plate.sides.has(sideId)) { toast(s, `${side.name} sudah ada di piring.`); return false; }
  s.plate.sides.add(sideId);
  return true;
}

// Kosongkan piring (sate kembali? tidak — dibuang, itu biayanya).
export function clearPlate(s) {
  s.plate = { skewers: 0, sides: new Set() };
  toast(s, 'Piring dikosongkan.');
}

export function plateSummary(s) {
  const names = [...s.plate.sides].map((id) => SIDES.find((x) => x.id === id).name);
  return `${s.plate.skewers} tusuk sate${names.length ? ' + ' + names.join(', ') : ''}`;
}
