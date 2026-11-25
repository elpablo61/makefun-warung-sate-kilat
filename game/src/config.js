// Warung Sate Kilat — palette + tuning. PALETTE FIRST (pixel-art skill):
// every colour in the game comes from this file, nothing else hard-codes one.
export const PALETTE = {
  charcoal: '#1a1210', // arang gelap — background malam
  charcoalSoft: '#2a1d18', // panel gelap
  amber: '#ff9a3c', // api — highlight, api grill
  ember: '#e25822', // bara
  wood: '#8a5a33', // kayu hangat — counter, meja
  woodDark: '#5e3a1e', // kayu gelap
  lime: '#9dc08b', // hijau limau — segar, OK, perfect
  chili: '#d64541', // merah cabai — bahaya, gosong, marah
  cream: '#f5e6c8', // krem — teks utama, piring
  creamDim: '#d8c49a', // krem redup — teks sekunder
  gold: '#f2c14e', // emas — skor, kombo
  smoke: '#6b5b52', // asap
};

export const TUNE = {
  canvasW: 1280,
  canvasH: 720,
  grillSlots: 6,
  // skewer cook timeline (seconds on the grill)
  cookPerfectAt: 5, // matang mulai di sini
  cookBurntAt: 9, // gosong mulai di sini
  cookMax: 12, // gosong total, harus dibuang
  orderPatience: 45, // detik per pesanan
  orderSpawnEvery: 12, // detik antar pesanan baru
  maxOrders: 4, // papan order maks
  shiftTargetScore: 1500, // menang bila skor capai ini
  shiftTargetOrders: 8, // atau 8 pesanan tersaji
  lives: 3, // pelanggan pergi 3x = kalah
  scorePerSkewer: 40,
  scorePerSide: 15,
  scoreServeBase: 60,
  timeBonusMax: 80, // bonus sajikan cepat
  comboStep: 0.25, // +25% per kombo beruntun
  wrongServePenalty: 50,
  burntPenalty: 10,
};

// Resep: tiap pesanan = jumlah sate + sisi wajib (lontong/bumbu/bawang).
export const SIDES = [
  { id: 'lontong', name: 'Lontong', key: 'Q', color: '#f5e6c8' },
  { id: 'bumbu', name: 'Bumbu Kacang', key: 'W', color: '#c98a3d' },
  { id: 'bawang', name: 'Bawang Goreng', key: 'E', color: '#e8b64c' },
];

export const CUSTOMERS = [
  'Pak Budi', 'Mbak Sari', 'Mas Joko', 'Bu Ratna', 'Dek Agus',
  'Kang Dedi', 'Mbak Lina', 'Pak Slamet', 'Neng Rina', 'Bang Udin',
];
