// lib/audio.js
// Low Web Audio "stomach rumble" played when a submitted standup note is
// vague or under-specified. Browser-only: every call is a safe no-op during
// SSR or when the browser lacks Web Audio support.
//
// Usage from app/page.js:
//   import { playRumble, unlockAudio, setMuted } from '@/lib/audio';
//   unlockAudio(); // on first pointer interaction
//   playRumble({ intensity: parsed.vagueness }); // 0..1 from parseStandup

let audioCtx = null;
let muted = false;

/**
 * Create (or resume) the shared AudioContext. Call from a user gesture
 * (e.g. the form submit) so browsers allow sound without a click first.
 * @returns {boolean} true if an AudioContext is available.
 */
export function unlockAudio() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return Boolean(ctx);
}

/** Toggle whether rumbles are silenced (for the mute control). */
export function setMuted(next) {
  muted = Boolean(next);
}

export function isMuted() {
  return muted;
}

/**
 * Play a low rumble whose depth and grit scale with vagueness.
 * @param {object} [options]
 * @param {number} [options.intensity=1] 0..1, typically the vagueness score.
 * @param {number} [options.duration=1.6] Seconds of rumble.
 * @returns {boolean} true if sound was scheduled.
 */
export function playRumble({ intensity = 1, duration = 1.6 } = {}) {
  const ctx = getAudioContext();
  if (!ctx || muted) return false;

  const level = Math.min(1, Math.max(0.15, Number(intensity) || 0.15));
  const dur = Math.min(3, Math.max(0.8, Number(duration) || 1.6));
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.connect(ctx.destination);

  // Deep throb: a sine that slides down as the stomach "settles".
  const throb = ctx.createOscillator();
  throb.type = 'sine';
  throb.frequency.setValueAtTime(54, now);
  throb.frequency.exponentialRampToValueAtTime(36, now + dur);

  const throbGain = ctx.createGain();
  throbGain.gain.value = 0.85 * level;
  throb.connect(throbGain);
  throbGain.connect(master);

  // Wobble LFO so the rumble chugs instead of humming.
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 5 + 4 * level;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.3 * level;
  lfo.connect(lfoDepth);
  lfoDepth.connect(throbGain.gain);

  // Filtered noise for a gritty growl under the throb.
  const noise = createNoiseSource(ctx, dur);
  const growl = ctx.createBiquadFilter();
  growl.type = 'lowpass';
  growl.frequency.value = 130 + 140 * level;
  growl.Q.value = 4;
  const growlGain =