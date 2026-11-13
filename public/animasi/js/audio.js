/**
 * Nusa Antara — Barong Audio Synthesizer (Web Audio API)
 * Pure procedural audio synthesis for gamelan chimes, speech blips, and UI SFX.
 */

class BarongAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;

    // Load saved sound preference
    try {
      const savedMute = localStorage.getItem('barong_audio_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    } catch (e) {
      this.isMuted = false;
    }
  }

  /**
   * Lazily initialize AudioContext on user interaction
   */
  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : 0.35;
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Toggle audio mute state
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('barong_audio_muted', String(this.isMuted));
    } catch (e) {}

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, now);
    }

    return this.isMuted;
  }

  /**
   * Play Gamelan Bell Chime (Nusantara metallophone tone)
   * Simulated with dual sine oscillators + inharmonic overtone + exponential decay.
   */
  playReceiveSound() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Pentatonic scale notes (Pelog / Slendro frequencies)
    const tones = [587.33, 739.99, 880.00]; // D5, F#5, A5 chord
    tones.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = index === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.04);

      // Bell envelope: instant strike, slow resonance decay
      gain.gain.setValueAtTime(0.001, now + index * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.25 / (index + 1), now + index * 0.04 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.04 + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + index * 0.04);
      osc.stop(now + index * 0.04 + 1.25);
    });
  }

  /**
   * Play User Send Click / Bamboo Woodblock sound
   */
  playSendSound() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Frequency drops rapidly like a gentle wood tap
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Play subtle speech typewriter blip
   */
  playSpeechBlip() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Gentle high-pitched harmonic blip
    const pitch = 380 + Math.random() * 80;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.045);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BarongAudio;
} else {
  window.BarongAudio = BarongAudio;
}

