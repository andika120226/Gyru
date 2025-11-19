// Sound Effects Manager
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const audioContextClass =
        window.AudioContext || window.webkitAudioContext;
      this.audioContext = new audioContextClass();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3; // Volume control
    } catch (error) {
      console.log("Web Audio API not supported:", error);
    }
  }

  // Generate a click sound using oscillator
  playClickSound(frequency = 800, duration = 0.1) {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Configure oscillator
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + duration);

    // Configure gain (volume envelope)
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    // Play
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  // Play success sound (two tones)
  playSuccessSound() {
    if (!this.audioContext) return;
    this.playClickSound(800, 0.1);
    setTimeout(() => this.playClickSound(1000, 0.1), 100);
  }

  // Play error sound
  playErrorSound() {
    if (!this.audioContext) return;
    this.playClickSound(400, 0.2);
  }

  // Play notification sound
  playNotificationSound() {
    if (!this.audioContext) return;
    this.playClickSound(600, 0.15);
  }

  // Set master volume (0 to 1)
  setVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
}

// Create global sound manager instance
const soundManager = new SoundManager();

// Add click sound to all interactive elements
document.addEventListener("DOMContentLoaded", () => {
  const interactiveElements = document.querySelectorAll(
    "button, a, input[type='checkbox'], .menu-card, .card"
  );

  interactiveElements.forEach((element) => {
    element.addEventListener("click", (e) => {
      // Don't play if element is disabled
      if (!element.disabled && !element.classList.contains("disabled")) {
        soundManager.playClickSound();
      }
    });

    // Add hover sound for desktop
    element.addEventListener("mouseenter", () => {
      if (window.innerWidth > 768) {
        // Only on desktop
        // Optional: uncomment for hover sound
        // soundManager.playClickSound(700, 0.05);
      }
    });
  });

  // Add sound to checkbox toggles
  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      soundManager.playSuccessSound();
    });
  });

  // Global sound toggle button (if exists)
  const soundToggle = document.getElementById("sound-toggle");
  if (soundToggle) {
    soundToggle.addEventListener("change", (e) => {
      if (e.target.checked) {
        soundManager.setVolume(0.3);
      } else {
        soundManager.setVolume(0);
      }
    });
  }
});

// Export for other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = SoundManager;
}
