// src/lobby/lobbyUI.js
import { getActiveLobby } from "../../../components/lobby/Lobby";
import { getState } from "../../../utils/state";
export function renderLobbyList(lobbies) {
    const list = document.getElementById('lobbyList');
    // const lobbyList = getState().lobbies;
    list.innerHTML = '';
    // lobbyList.forEach(lobby => {
    //   const li = document.createElement('li');
    //   li.textContent = lobby.name;
    //   list.appendChild(li);
    // });
    lobbies.forEach(lobby => {
      const li = document.createElement('li');
      li.textContent = lobby.name;
      list.appendChild(li);
    });
  }
  