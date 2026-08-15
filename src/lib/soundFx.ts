// Web Audio API Synthesizer for iPadOS-Style ASMR Micro-Sounds
// Zero external files needed, 100% native, instant latency, 60fps safe

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;
let lastHoverTime = 0;
let lastTapTime = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Check local storage for mute preference
if (typeof window !== "undefined") {
  try {
    isAudioMuted = localStorage.getItem("findely_sfx_muted") === "true";
  } catch (e) {}
}

export function isMuted(): boolean {
  return isAudioMuted;
}

export function toggleMute(): boolean {
  isAudioMuted = !isAudioMuted;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("findely_sfx_muted", String(isAudioMuted));
    } catch (e) {}
  }
  return isAudioMuted;
}

/**
 * 1. Crisp iPadOS Glass Tap / Tactile ASMR Bubble Pop (Primary Click & Press)
 */
export function playTapSound(delayMs = 12) {
  if (isAudioMuted) return;
  const nowMs = Date.now();
  if (nowMs - lastTapTime < 45) return; // Prevent double-triggering
  lastTapTime = nowMs;

  setTimeout(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Velvety mechanical glass popple
      osc.type = "sine";
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.032);

      // Low-pass filter for soft tactile matte texture
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2200, now);
      filter.frequency.exponentialRampToValueAtTime(600, now + 0.032);

      // Natural tactile envelope
      gain.gain.setValueAtTime(0.048, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.032);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }, delayMs);
}

/**
 * 2. Magnetic / Wooden Grip Pickup (Drag Start)
 */
export function playGrabSound(delayMs = 15) {
  if (isAudioMuted) return;
  setTimeout(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, now);

      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {}
  }, delayMs);
}

/**
 * 3. Soft Magnetic Dock Drop / Settle Snick (Drag Release)
 */
export function playReleaseSound(delayMs = 8) {
  if (isAudioMuted) return;
  setTimeout(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.028);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }, delayMs);
}

/**
 * 4. Micro Air Hover Tick (Interactive Boundary Enter Only - Throttled & Velvety)
 */
export function playHoverTick(delayMs = 10) {
  if (isAudioMuted) return;
  const nowMs = Date.now();
  if (nowMs - lastHoverTime < 110) return; // Strict throttle for soothing ASMR pace
  lastHoverTime = nowMs;

  setTimeout(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.016);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2400, now);

      gain.gain.setValueAtTime(0.014, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.016);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.018);
    } catch (e) {}
  }, delayMs);
}

/**
 * 5. Success / Action Confirmation Chime
 */
export function playSuccessChime() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const noteTime = now + i * 0.05;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.035, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.13);
    });
  } catch (e) {}
}
