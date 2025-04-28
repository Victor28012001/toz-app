import { init } from "../../avatar-customizer.js";

export function createCharacterComponent(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const parent = container;

  // Remove all siblings of container
  Array.from(parent.children).forEach((child) => {
    if (child !== container) {
      child.remove();
    }
  });

  // Add expansion class to parent
  parent.classList.add("new-parent-expanded");

  container.innerHTML = `
      <div class="body">
        <header><h2>Character</h2></header>
        <div class="parent">
          <div class="cont">
          <h2>Characters</h2>
          </div>
          <div class="cont" id="characters"></div>
          <div class="cont"></div>
        </div>
      </div>
    `;
  // Now initialize the character customizer
  init();
}
