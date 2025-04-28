// components/Matchmaking.js
import socket from "../js/socket.js";

class Matchmaking {
  constructor() {
    this.isSearching = false;
    this.render();
  }

  startSearch() {
    this.isSearching = true;
    socket.emit("startMatchmaking", { walletAddress: "sample-wallet-address" });
    this.render();
  }

  stopSearch() {
    this.isSearching = false;
    socket.emit("stopMatchmaking", { walletAddress: "sample-wallet-address" });
    this.render();
  }

  render() {
    const container = document.getElementById("root");

    container.innerHTML = `
      <div class="p-4">
        <h1 class="text-2xl font-semibold mb-4">Matchmaking</h1>
        ${this.isSearching ? `
          <button onclick="matchmaking.stopSearch()" class="bg-red-500 text-white p-2">Stop Search</button>
        ` : `
          <button onclick="matchmaking.startSearch()" class="bg-blue-500 text-white p-2">Start Search</button>
        `}
      </div>
    `;
  }
}

const matchmaking = new Matchmaking();
export default matchmaking;
