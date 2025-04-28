import { hoverSound, selectionSound } from "../constants.js";
import { getSoundEnabled } from "./SoundToggleButton.js";

export function ScrambleHoverEffect(options = {}) {
    const {
      selector = "h1, h2, h3, h4, h5, h6, button",
      excludedIds = ["toggle-music"],
      duration = 500,
      intervalTime = 30,
    } = options;
  
    const intervalMap = new WeakMap();
  
    const elements = Array.from(document.querySelectorAll(selector)).filter(
      (el) => !excludedIds.includes(el.id)
    );
  
    const scrambleText = (element, toUpperCase = true) => {
      const originalText = element.dataset.content;
      const labelArray = originalText.split("");
      const keys = [...Array(labelArray.length).keys()].sort(() => Math.random() - 0.5);
      const loops = Math.ceil(duration / (labelArray.length * intervalTime));
      let intervalIndex = 0;
  
      clearInterval(intervalMap.get(element));
  
      const intervalId = setInterval(() => {
        if (intervalIndex < keys.length * loops) {
          const loop = Math.ceil((intervalIndex + 1) / keys.length);
          const key = keys[intervalIndex % keys.length];
  
          if (loop !== loops) {
            labelArray[key] = Math.random().toString(36).substring(4, 5).toUpperCase();
          } else {
            labelArray[key] = toUpperCase
              ? originalText.charAt(key).toUpperCase()
              : originalText.charAt(key);
          }
  
          element.textContent = labelArray.join("");
          intervalIndex++;
        } else {
          clearInterval(intervalMap.get(element));
        }
      }, intervalTime);
  
      intervalMap.set(element, intervalId);
    };
  
    elements.forEach((element) => {
      const originalText = element.textContent.trim();
      element.dataset.content = element.dataset.content || originalText;
  
      element.addEventListener("mouseenter", (e) => {
        const target = e.currentTarget;
        if (getSoundEnabled()) {
          const tag = target.tagName.toLowerCase();
          const sound = tag !== "button" ? hoverSound : selectionSound;
          if (sound) {
            sound.currentTime = 0;
            sound.play().catch((e) => console.warn("Sound play error:", e));
          }
        }
        scrambleText(target, true);
      });
  
      element.addEventListener("mouseleave", (e) => {
        const target = e.currentTarget;
        if (getSoundEnabled()) {
          const tag = target.tagName.toLowerCase();
          const sound = tag !== "button" ? hoverSound : selectionSound;
          if (sound) {
            sound.currentTime = 0;
            sound.play().catch((e) => console.warn("Sound play error:", e));
          }
        }
        scrambleText(target, false);
      });
    });
  }
  