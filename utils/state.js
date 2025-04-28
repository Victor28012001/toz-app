// utils/state.js

// Global application state
const state = {
    user: null,                   // Logged-in user info
    socket: null,                 // Socket instance
    currentLobby: null,          // Current lobby details
    lobbies: [],                 // List of all lobbies
    chatMessages: [],            // Messages (could be per room if expanded)
    friends: [],                 // Friend list
    friendRequests: [],          // Incoming friend requests
    tournaments: [],             // Available tournaments
    activeTournament: null,      // Currently joined tournament
  };
  
  // Get state
  export const getState = () => state;
  
  // Mutate state
  export const setUser = (user) => { state.user = user; };
  export const setSocket = (socketInstance) => { state.socket = socketInstance; };
  export const setCurrentLobby = (lobby) => { state.currentLobby = lobby; };
  export const setLobbies = (lobbies) => { state.lobbies = lobbies; };
  export const addChatMessage = (msg) => { state.chatMessages.push(msg); };
  export const setFriends = (friends) => { state.friends = friends; };
  export const setFriendRequests = (requests) => { state.friendRequests = requests; };
  export const setTournaments = (tournaments) => { state.tournaments = tournaments; };
  export const setActiveTournament = (tournament) => { state.activeTournament = tournament; };
  
  // Clear state (use on logout)
  export const clearState = () => {
    state.user = null;
    state.socket = null;
    state.currentLobby = null;
    state.lobbies = [];
    state.chatMessages = [];
    state.friends = [];
    state.friendRequests = [];
    state.tournaments = [];
    state.activeTournament = null;
  };
  