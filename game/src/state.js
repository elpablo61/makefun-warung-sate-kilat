// Warung Sate Kilat — state: one object, one job: hold the whole game state.
import { TUNE } from './config.js';

export function createState() {
  return {
    screen: 'title', // title | playing | won | lost
    time: 0, // detik sejak shift mulai
    score: 0,
    combo: 0, // sajian sempurna beruntun
    bestCombo: 0,
    lives: TUNE.lives,
    served: 0, // pesanan tersaji
    lost: 0, // pelanggan pergi
    orders: [], // {id, customer, skewers, sides, patience, maxPatience, state}
    grill: Array.from({ length: TUNE.grillSlots }, () => null), // skewer | null
    plate: { skewers: 0, sides: new Set() }, // piring yang sedang dirakit
    selectedOrder: 0, // pesanan yang dituju piring ini
    spawnTimer: 4, // pesanan pertama cepat muncul
    nextOrderId: 1,
    message: '', // toast singkat
    messageT: 0,
    sizzle: 0, // animasi bara
    smoke: [], // partikel asap
    stars: [], // partikel bintang skor
    muted: false,
  };
}

export function resetState(s) {
  const fresh = createState();
  Object.keys(fresh).forEach((k) => { s[k] = fresh[k]; });
  s.screen = 'playing';
}

export function toast(s, text) {
  s.message = text;
  s.messageT = 2.2;
}
