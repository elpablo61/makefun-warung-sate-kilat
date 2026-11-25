# Warung Sate Kilat

[![Warung Sate Kilat](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![Rank](https://make.fun/badge/best-cooking-game-20261125-0137/elpablo61/makefun-warung-sate-kilat/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![Entries](https://make.fun/badge/best-cooking-game-20261125-0137/elpablo61/makefun-warung-sate-kilat/entries.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![Reward](https://make.fun/badge/best-cooking-game-20261125-0137/elpablo61/makefun-warung-sate-kilat/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)

Warung sate malam hari. Pesanan datang ke papan order, arang menyala di
panggangan, pelanggan lapar dan tidak sabar. Bakar sate sampai matang tepat
waktu, rakit piring sesuai pesanan, sajikan sebelum pelanggan pergi.

## Cara main

1. **Klik Sate Mentah** di counter — tusuk masuk ke grill.
2. **Tunggu sampai matang** (cokelat keemasan, panah emas berdenyut). Terlalu
   lama = gosong, harus dibuang.
3. **Klik sate matang** untuk mengangkatnya ke piring.
4. **Klik Q / W / E** untuk lontong, bumbu kacang, bawang goreng.
5. **Spasi / tombol SAJIKAN** untuk mengantar piring ke pelanggan yang dipilih
   (klik kartu pesanan di papan untuk memilih).

**Menang:** skor 1.500 atau 8 pesanan tersaji. **Kalah:** 3 pelanggan pergi.

## Kontrol

| Aksi | Mouse | Keyboard |
| --- | --- | --- |
| Taruh sate mentah ke grill | Klik tumpukan sate | — |
| Angkat sate dari grill | Klik slot grill | `1`–`6` |
| Tambah sisi ke piring | Klik tombol sisi | `Q` / `W` / `E` |
| Sajikan piring | Klik SAJIKAN | `Spasi` |
| Kosongkan piring | Klik tombol | `C` |
| Pilih pesanan | Klik kartu pesanan | `↑` / `↓` |
| Restart | — | `R` |
| Suara | — | `M` |

## Mekanik

- **Papan order** 2–4 pesanan, masing-masing dengan timer kesabaran pelanggan.
- **Grill timing:** mentah → matang (5 detik) → gosong (9 detik). Jendela
  matang yang tepat adalah inti permainan.
- **Rakit piring:** sate + sisi wajib sesuai pesanan; salah sajian kena denda.
- **Skor + kombo:** sajian cepat dapat bonus waktu; sajian beruntun menaikkan
  pengali kombo. Gosong dan salah sajian memutus kombo.
- **Rush:** pesanan datang makin cepat seiring shift berjalan.

## Struktur

- `game/index.html` — halaman game, tanpa network request
- `game/src/config.js` — palet + tuning (palet dikunci dulu sebelum gambar)
- `game/src/state.js` — state permainan
- `game/src/orders.js` — spawn, timer, dan skor pesanan
- `game/src/grill.js` — logika bakar sate
- `game/src/plate.js` — rakit piring
- `game/src/render.js` — semua gambar canvas 2D (sprite digambar kode)
- `game/src/input.js` — mouse + keyboard
- `game/src/audio.js` — beep WebAudio
- `game/src/main.js` — game loop
- `main.ts` — menyerahkan game + screenshots + dossier ke `/output`

Semua seni digambar dari kode (canvas 2D, tanpa aset eksternal), semua suara
dari WebAudio. Game berjalan offline penuh dari file statis.

## Jalankan

```sh
node serve.ts   # atau: python3 -m http.server -d game
# buka http://localhost:8080
```

## Lisensi

MIT — lihat `LICENSE`.
