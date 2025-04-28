import socket from '../../utils/socket.js';
let activeLobby = null;
export function setupLobbyHandlers() {
  socket.on("gameMatchFound", ({ lobbyId, gameId, players }) => {
    console.log("🎮 Match Found!");
    console.log("Lobby:", lobbyId);
    console.log("Players:", players);
  });
  
  // Listen to fallback
  socket.on("matchmakingFallback", ({ message }) => {
    console.warn("⚠️ Fallback:", message);
    // trigger solo AI battle here
  });
  
  // Listen to error
  socket.on("matchmakingError", ({ message }) => {
    console.error("❌ Matchmaking Error:", message);
  });
  
  // Listen to leave confirmation
  socket.on("leftMatchmaking", ({ message }) => {
    console.log("⏹️", message);
  });
  

  socket.on('readyCheckUpdate', ({ player, ready }) => {
    console.log(`${player.walletAddress} is ${ready ? 'ready' : 'not ready'}`);
  });

  socket.on('gameStart', ({ message }) => {
    console.log(message);
    // transition UI to game scene
  });

  socket.on('chatMessage', ({ walletAddress, message }) => {
    console.log(`${walletAddress}: ${message}`);
    // display in lobby chat
  });

  socket.on('kickedFromLobby', ({ message }) => {
    alert(message);
    // redirect or update UI
  });

  socket.on('gameEnd', ({ result }) => {
    console.log('Game ended:', result);
  });

  socket.on('lobbyCreated', ({ lobbyId }) => {
    console.log(`Lobby created with ID: ${lobbyId}`);
    activeLobby = lobbyId;
  });

  socket.on("reconnectedToLobby", ({ message, lobbyId, player }) => {
    console.log("✅", message, "Lobby ID:", lobbyId, "Player:", player);
  });

}

// export function joinMatchmaking(playerData) {
//   socket.emit('joinMatchmaking', playerData);
// }

export function reconnectToLobby(walletAddress) {
  socket.emit("reconnectPlayer", { walletAddress });
}

export function joinLobby(data) {
  socket.emit('joinLobby', data);
}

export function sendLobbyMessage(data) {
  socket.emit('lobbyMessage', data);
}

export function playerReady(data) {
  socket.emit('playerReady', data);
}

export function endGame(data) {
  socket.emit('endGame', data);
}

export function kickPlayer(data) {
  socket.emit('kickPlayer', data);
}

export function leaveLobby() {
  socket.emit('leaveLobby', { lobbyId: activeLobby });
  activeLobby = null;
}

export function joinMatchmaking(walletAddress, characterId, gameId) {
  socket.emit("joinMatchmaking", { walletAddress, characterId, gameId });
}

// Leave matchmaking if needed
export function leaveMatchmaking(walletAddress, gameId) {
  socket.emit("leaveMatchmaking", { walletAddress, gameId });
}

export function getActiveLobby() {
  return activeLobby;
}
