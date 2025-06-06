class AudioService {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
  }

  init(audioUrl) {
    if (!this.audio) {
      this.audio = new Audio(audioUrl);
      this.audio.loop = true;
      this.audio.volume = 0.2; // Start with lower volume
    }
  }

  play() {
    if (this.audio && !this.isPlaying) {
      this.audio.play()
        .then(() => {
          this.isPlaying = true;
          console.log('Background audio started');
        })
        .catch(err => {
          console.error('Failed to play audio:', err);
        });
    }
  }

  stop() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
    }
  }

  setVolume(level) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, level));
    }
  }
}

// Create a singleton instance
const audioService = new AudioService();
export default audioService;