// Warung Sate Kilat — audio: beep WebAudio sederhana, tanpa file suara.
export function createAudio(s) {
  let ctx = null;
  function ac() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; }
    }
    return ctx;
  }
  function beep(freq, dur, type = 'sine', vol = 0.12) {
    if (s.muted) return;
    const c = ac();
    if (!c) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.connect(g).connect(c.destination);
    o.start();
    o.stop(c.currentTime + dur);
  }
  return {
    resume() { const c = ac(); if (c && c.state === 'suspended') c.resume(); },
    click() { beep(660, 0.07, 'square', 0.06); },
    pickup() { beep(520, 0.09, 'triangle', 0.1); beep(780, 0.09, 'triangle', 0.08); },
    sizzle() { beep(180, 0.25, 'sawtooth', 0.05); },
    serve() { beep(523, 0.12, 'sine', 0.12); setTimeout(() => beep(784, 0.18, 'sine', 0.12), 110); },
    error() { beep(160, 0.2, 'square', 0.08); },
    win() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.2, 'sine', 0.12), i * 130)); },
    lose() { [392, 330, 262].forEach((f, i) => setTimeout(() => beep(f, 0.25, 'triangle', 0.1), i * 160)); },
  };
}
