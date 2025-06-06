class SoundEffectsService {
  constructor() {
    this.enabled = true;
    this.clickSound = new Audio('/click.wav');
  }

  playClick() {
    if (this.enabled) {
      // Clone the audio to allow multiple rapid clicks
      const soundClone = this.clickSound.cloneNode();
      soundClone.volume = 0.3;
      soundClone.play().catch(err => {
        console.error('Failed to play click sound:', err);
      });
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

// Create a singleton instance
const soundEffectsService = new SoundEffectsService();
export default soundEffectsService;