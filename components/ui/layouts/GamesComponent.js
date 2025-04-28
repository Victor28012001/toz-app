import { create3DSpace } from "../game/script.js";
export function createGamesComponent(containerId) {
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
        <header><h2>Games</h2></header>
        <div class="parent">
          <div class="cont"></div>
          <div class="cont" id="td-space"></div>
          <div class="cont"> 
          </div>
        </div>
      </div>
    `;

    create3DSpace();
  
  }
  