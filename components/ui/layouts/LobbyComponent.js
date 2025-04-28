import { setupLobbyHandlers, joinMatchmaking, joinLobby, sendLobbyMessage, playerReady } from '../../lobby/Lobby.js';

export function createLobbyComponent(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    setupLobbyHandlers();
  
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
        <header><h2>Lobby</h2></header>
        <div class="parent">
          <div class="cont"></div>
          <div class="cont"></div>
          <div class="cont">
            
          </div>
        </div>
      </div>
    `;
  
    
  }
  