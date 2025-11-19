// Sound Manager menggunakan Web Audio API
class SoundManager {
  constructor() {
    // Initialize audio context
    this.audioContext = null;
    this.masterVolume = 0.3; // 30% volume untuk tidak mengganggu
  }

  // Initialize audio context (call saat user interact pertama kali karena browser restrictions)
  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
  }

  // Generate click sound (short beep)
  playClickSound() {
    try {
      this.initAudioContext();
      const context = this.audioContext;

      // Create oscillator untuk frekuensi suara
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Sound properties
      oscillator.frequency.value = 800; // 800 Hz frequency
      oscillator.type = "sine"; // smooth sine wave

      // Volume envelope
      gainNode.gain.setValueAtTime(this.masterVolume, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        context.currentTime + 0.05
      );

      // Timing
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.05); // 50ms duration
    } catch (error) {
      console.log(
        "Sound play error (ini normal di beberapa browser):",
        error.message
      );
    }
  }

  // Generate hover sound (softer, lower pitch)
  playHoverSound() {
    try {
      this.initAudioContext();
      const context = this.audioContext;

      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = 600; // Lower frequency
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(
        this.masterVolume * 0.6,
        context.currentTime
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        context.currentTime + 0.03
      );

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.03); // 30ms duration
    } catch (error) {
      console.log("Sound play error:", error.message);
    }
  }

  // Generate success sound (double beep)
  playSuccessSound() {
    try {
      this.initAudioContext();
      const context = this.audioContext;

      // First beep
      const osc1 = context.createOscillator();
      const gain1 = context.createGain();
      osc1.connect(gain1);
      gain1.connect(context.destination);

      osc1.frequency.value = 600;
      osc1.type = "sine";
      gain1.gain.setValueAtTime(this.masterVolume, context.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

      osc1.start(context.currentTime);
      osc1.stop(context.currentTime + 0.1);

      // Second beep
      const osc2 = context.createOscillator();
      const gain2 = context.createGain();
      osc2.connect(gain2);
      gain2.connect(context.destination);

      osc2.frequency.value = 800;
      osc2.type = "sine";
      gain2.gain.setValueAtTime(this.masterVolume, context.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.22);

      osc2.start(context.currentTime + 0.12);
      osc2.stop(context.currentTime + 0.22);
    } catch (error) {
      console.log("Sound play error:", error.message);
    }
  }

  // Set master volume (0 to 1)
  setVolume(level) {
    this.masterVolume = Math.max(0, Math.min(1, level));
  }

  // Mute/Unmute
  toggleMute() {
    this.masterVolume = this.masterVolume > 0 ? 0 : 0.3;
    return this.masterVolume > 0;
  }
}

// Create global sound manager instance
const soundManager = new SoundManager();

// User interaction tracker untuk mencegah spam
let lastSoundTime = 0;
const SOUND_DEBOUNCE_MS = 50; // Jangan play sound lebih dari 1x per 50ms

function playSoundDebounced(soundType = "click") {
  const now = Date.now();
  if (now - lastSoundTime < SOUND_DEBOUNCE_MS) return;
  lastSoundTime = now;

  if (soundType === "hover") {
    soundManager.playHoverSound();
  } else if (soundType === "success") {
    soundManager.playSuccessSound();
  } else {
    soundManager.playClickSound();
  }
}
