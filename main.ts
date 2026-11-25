// Warung Sate Kilat — entrypoint (Node 22, standard library only).
// Menyerahkan game ke /output: menyalin game/ dan screenshots/ dari repo ini,
// lalu menulis /output/dossier.json lewat buildDossier dari vendor/makefun-game.ts.
// Di luar grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas gate (reference/gate.json): hanya text_max_bytes yang membentuk byte;
// yang lain menolak entri yang akan ditolak scorer (lebih dari 4 screenshot atau
// satu di atas 256 KiB; lebih dari 993 file di game/ atau 48 MiB total, atau path
// di bawah game/ di atas 1000 byte: game/ dihitung bersama batas 1000 entri /output).
// Program ini murni menyalin + menulis dossier: dua run menulis byte yang sama,
// sesuai syarat grader (kedua run harus identik).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
