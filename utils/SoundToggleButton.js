import { toggleBtn, bgMusic, visualizer, button } from "../constants.js";

let isPlaying = false;
let soundEnabled = false;

export function setSoundEnabled(val) {
  soundEnabled = val;
}

export function getSoundEnabled() {
  return soundEnabled;
}

bgMusic.volume = 0.4;

/**
 * Initializes a sound toggle button component.
 * 
 * @param {Object} options
 * @param {HTMLElement} options.toggleBtn - The DOM element for toggling sound.
 * @param {HTMLAudioElement} options.bgMusic - The background music Audio instance.
 * @param {HTMLElement} [options.visualizer] - Optional visualizer element to reflect playing state.
 */
export function SoundToggleButton() {
  if (!toggleBtn || !bgMusic) {
    console.warn("SoundToggleButton requires both `toggleBtn` and `bgMusic`.");
    return;
  }

  toggleBtn.addEventListener("click", () => {
    if (!isPlaying) {
      bgMusic.play();
      visualizer?.classList.add("playing");
      setSoundEnabled(true);
    } else {
      bgMusic.pause();
      visualizer?.classList.remove("playing");
      setSoundEnabled(false);
    }
    isPlaying = !isPlaying;
  });
}

/**
 * Plays a short sound if sound is enabled.
 * 
 * @param {HTMLAudioElement} sound - The audio to play.
 */
export function playSoundIfEnabled(sound) {
  if (getSoundEnabled() && sound) {
    sound.currentTime = 0;
    sound.play().catch((e) => console.warn("Sound play error:", e));
  }
}

button.addEventListener("click", () => {
  playSoundIfEnabled(walletConnect);
});