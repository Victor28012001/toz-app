import {
  fetchRecentMessages,
  getChatHistory,
  markMessageAsRead,
  getUserMessages,
} from "../../chat/messageHandler.js";
import { joinChatroom, markPrivateMessagesAsRead } from "../../chat/Chat.js";
import { getState } from "../../../utils/state.js";
import { distanceInWordsToNow } from "../../../utils/distanceInWordsToNow.js";

let playerId;
let userAvatar
if(getState().user === null || getState().user === undefined) {
  playerId = JSON.parse(localStorage.getItem("user"));
}else {
  playerId = getState().user_id;
  userAvatar = getState().user.avatarUrl || "default_avatar.png"; // Fallback to default avatar
}


let currentChatUserId = null;

// DOM Helpers
const getMessagesEl = () => document.getElementById("messages");
const getRecentChatsEl = () => document.getElementById("recent-chats");
const getRecentMessagesEl = () => document.getElementById("recent-messages");

// Join personal room on load
// joinChatroom({playerId});

// Initialize Chat
export function init() {
  loadRecentChats();
}

// Load recent chats (Sidebar)
export async function loadRecentChats() {
  const container = getRecentChatsEl();
  if (!container) return;

  const removed = JSON.parse(localStorage.getItem("removedChats") || "[]");
  const chats = await fetchRecentMessages(playerId);

  container.innerHTML = "<h3>Recent DMs</h3>";

  chats.forEach((msg) => {
    // ✅ Only show if the player is the recipient
    if (msg.recipient !== playerId) return;

    const userId = msg.sender;

    // ✅ Skip if removed from localStorage
    if (removed.includes(userId)) return;

    const chatEl = document.createElement("div");
    chatEl.className = "chat-user";
    if (!msg.read) {
      chatEl.classList.add("unread");
    }

    chatEl.innerText = `User ${userId}: ${msg.message}`;
    chatEl.onclick = () => openChat(userId);

    container.appendChild(chatEl);
  });

  loadRecentMessages(); // Optional – if this loads chat previews or does something else
}

// Load recent message previews
export async function loadRecentMessages() {
  const container = getRecentMessagesEl();
  if (!container) return;

  const chatList = await getUserMessages(playerId);
  chatList.sort(
    (a, b) =>
      new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
  );

  container.innerHTML = ""; // Clear previous entries

  chatList.forEach(({ userId, lastMessage, moniker, avatar }) => {
    const messageEl = document.createElement("div");
    messageEl.className = "chat-message";

    if (lastMessage.recipient === playerId && !lastMessage.read) {
      messageEl.classList.add("unread");
    }

    const timeAgo = distanceInWordsToNow(lastMessage.timestamp, {
      addSuffix: true,
    });
    messageEl.innerHTML = `<span style="width: 120px; overflow: hidden; text-overflow: ellipsis;">${moniker}</span>: <span style="color: green; width: 400px; overflow: hidden; text-overflow: ellipsis;">${lastMessage.message}</span> - <span style="font-size: smaller">${timeAgo}</span>`;
    messageEl.onclick = () => openChat(userId, moniker, avatar);

    container.appendChild(messageEl);
  });
}

// Load full chat history with user
export async function openChat(userId, moniker, avatar) {
  currentChatUserId = userId;

  const messages = await getChatHistory(playerId, userId);
  const container = getMessagesEl();
  if (!container) return;

  container.innerHTML = `<h3 style="color: #fff;">${moniker}</h3>`;

  messages.forEach((msg) => {
    const msgEl = createMessageBubble(msg, moniker, avatar);
    
    msgEl.classList.add("message-bubble");
    container.appendChild(msgEl);
  });

  await markMessageAsRead(userId, playerId); // DB update
  markPrivateMessagesAsRead(userId, playerId); // Socket update

  removeRecentChatFromUI(userId);
}

// Remove a user's preview from recent chat
export async function removeRecentChatFromUI(userIdToRemove) {
  const container = getRecentChatsEl();
  if (!container) return;

  // Save to localStorage
  let removed = JSON.parse(localStorage.getItem("removedChats") || "[]");
  if (!removed.includes(userIdToRemove)) {
    removed.push(userIdToRemove);
    localStorage.setItem("removedChats", JSON.stringify(removed));
  }

  // Remove from UI
  const chats = container.querySelectorAll(".chat-user");
  chats.forEach((el) => {
    if (el.innerText.includes(`User ${userIdToRemove}:`)) {
      el.remove();
    }
  });
}

// Handle new incoming message in real-time
export function handleIncomingMessage(msg) {
  const container = getMessagesEl();
  const isOwn = msg.sender === playerId;
  const isCurrent =
    msg.sender === currentChatUserId || msg.recipient === currentChatUserId;

  if (!container || !isCurrent) return;

  const msgEl = createMessageBubble(msg);
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;

  loadRecentChats(); // Refresh unread indicator
}

// Create a styled message bubble
function createMessageBubble(msg, moniker, avatar) {
  const div = document.createElement("div");
  div.className = "message";
  div.style.display = "flex";

  const sender = document.createElement("div");
  sender.className = "sender";

  const content = document.createElement("div");
  content.className = "message-content";
  content.innerHTML = `<span>${msg.message}</span>`;
  const timeAgo = distanceInWordsToNow(msg.timestamp, {
    addSuffix: true,
  });
  const timeEl = document.createElement("div");
  timeEl.className = "message-time";
  timeEl.style.fontSize = "10px";
  timeEl.style.color = "#f0f0f0";
  timeEl.style.display = "inline-block";
  timeEl.innerText = timeAgo;
  content.appendChild(timeEl);

  const isPlayer = msg.sender === playerId;

  const avatarImg = document.createElement("img");
  avatarImg.src = isPlayer ? userAvatar : avatar || "default_avatar.png"; // Fallback to default avatar
  avatarImg.alt = "Avatar";
  avatarImg.className = "user-avatar";


  // sender.innerText = isPlayer ? "Me" : moniker;
  // sender.style.color = isPlayer ? "yellow" : "green";
  // content.style.color = sender.style.color;

  div.style.flexDirection = isPlayer ? "row-reverse" : "row";
  sender.style.marginLeft = isPlayer ? "10px" : "";
  sender.style.marginRight = !isPlayer ? "10px" : "";

  div.appendChild(avatarImg);
  // div.appendChild(sender);
  div.appendChild(content);
  return div;
}

// Chat user context
export function setCurrentChatUserId(id) {
  currentChatUserId = id;
}
export function getCurrentChatUserId() {
  return currentChatUserId;
}
