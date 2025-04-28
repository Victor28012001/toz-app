import { init, getCurrentChatUserId } from "../chat/chatUI.js";
import { setupListeners, sendPrivateMessage } from "../../chat/Chat.js";
import { getState } from "../../../utils/state.js";
import { createExpandableContainer } from "../friends/ExpandableContainer.js";

let playerId = null; // this should be set when the player logs in or joins
let msgInput, messagesEl;

export function createFriendsComponent(containerId, _playerId) {
  playerId = getState().user._id;

  const container = document.getElementById(containerId);
  if (!container) return;

  const parent = container;
  Array.from(parent.children).forEach((child) => {
    if (child !== container) child.remove();
  });
  parent.classList.add("new-parent-expanded");

  container.innerHTML = `
    <div class="body">
      <header><h2>Chats</h2></header>
      <div class="parent">
        <div class="cont">
          <div id="body">
            <div id="recent-chats"></div>
            <div id="recent-messages"></div>
          </div>
        </div>
        <div class="cont">
          <div id="chat-box">
            <div id="messages"></div>
              <div id="msg-down">
                <div style="height: fit-content;">
                  <label class="icon-button" for="file-upload">
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      ></path>
                    </svg>
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    style="display: none"
                  />
                </div>
                <input id="msg-input" type="text" placeholder="Type message..." />
                <button id="send-btn">
                    <span class="send-icon">
                      <svg class="icon-small rotated" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        ></path>
                      </svg>
                    </span>
                </button>
              </div>
          </div>
        </div>
        <div class="cont">
        <div id="myExpandableFriendContainer" class="myExpandableContainer"></div>
        </div>
      </div>
    </div>
  `;

  msgInput = document.getElementById("msg-input");
  messagesEl = document.getElementById("messages");
  const sendBtn = document.getElementById("send-btn");

  sendBtn.onclick = () => {
    const text = msgInput.value.trim();
    const chatUserId = getCurrentChatUserId(); // ID of the person you're chatting with

    if (text && chatUserId) {
      sendPrivateMessage(chatUserId, playerId, text); // emit via socket
      msgInput.value = ""; // Clear input
    }
  };
  createExpandableContainer("myExpandableFriendContainer", [
    "Friends",
    "Users",
    "ChatRooms",
    // "Lobbies",
  ]);

  init();
  setupListeners(playerId);

}
