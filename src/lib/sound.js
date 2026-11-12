/**
 * CyberLingo Audio Synthesizer
 * Provides crystal-clear audio effects (correct, wrong, complete)
 * using Web Audio API without needing external asset downloads.
 */

import { useUserStore } from '../store/userStore.js';

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a synthesized tone sequence
 */
function playTones(tones) {
  const { soundEnabled } = useUserStore.getState();
  if (!soundEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  tones.forEach(({ freq, start, duration, type = 'sine', gain = 0.15 }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now + start);

    gainNode.gain.setValueAtTime(gain, now + start);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + duration);
  });
}

/**
 * Play correct answer chime (Duolingo-style uplifting major chord)
 */
export function playCorrectSound() {
  playTones([
    { freq: 523.25, start: 0, duration: 0.12, type: 'triangle', gain: 0.2 }, // C5
    { freq: 659.25, start: 0.08, duration: 0.12, type: 'triangle', gain: 0.2 }, // E5
    { freq: 783.99, start: 0.16, duration: 0.28, type: 'triangle', gain: 0.25 } // G5
  ]);
  if (navigator.vibrate) {
    navigator.vibrate(40);
  }
}

/**
 * Play incorrect answer sound (low buzz)
 */
export function playWrongSound() {
  playTones([
    { freq: 220, start: 0, duration: 0.14, type: 'sawtooth', gain: 0.2 }, // A3
    { freq: 196, start: 0.12, duration: 0.25, type: 'sawtooth', gain: 0.2 } // G3
  ]);
  if (navigator.vibrate) {
    navigator.vibrate([60, 40, 60]);
  }
}

/**
 * Play lesson complete victory fanfare
 */
export function playCompleteSound() {
  playTones([
    { freq: 523.25, start: 0, duration: 0.15, type: 'triangle', gain: 0.2 }, // C5
    { freq: 659.25, start: 0.12, duration: 0.15, type: 'triangle', gain: 0.2 }, // E5
    { freq: 783.99, start: 0.24, duration: 0.18, type: 'triangle', gain: 0.25 }, // G5
    { freq: 1046.5, start: 0.38, duration: 0.45, type: 'triangle', gain: 0.3 } // C6
  ]);
  if (navigator.vibrate) {
    navigator.vibrate([80, 50, 100]);
  }
}
