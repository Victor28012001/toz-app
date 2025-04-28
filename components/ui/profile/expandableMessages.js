// expandableAssets.js
import { fetchRecentMessages } from "../../chat/messageHandler.js";
import { getState } from "../../../utils/state.js";
import { openChat } from "../chat/chatUI.js";

export async function createExpandableMessagesTabs() {
  const { _id: playerId } = getState().user;

  const removed = JSON.parse(localStorage.getItem("removedChats") || "[]");
  const chats = await fetchRecentMessages(playerId);

  console.log("chats", chats);

  const container = document.createElement("section");
  container.className = "asset-tabs";

  const tabsContent = document.createElement("div");
  tabsContent.className = "tabs-content";

  const tabPane = document.createElement("div");
  tabPane.className = "tab-pane";
  tabPane.setAttribute("data-category", "messages");

  chats.forEach((msg) => {
    if (msg.recipient !== playerId) {
      console.log("Not recipient, skipping:", msg);
      return;
    }

    const userId = msg.sender;
    // if (removed.includes(userId)) return;

    const chatEl = document.createElement("div");
    chatEl.className = "asset-card";
    if (!msg.read) {
      chatEl.classList.add("unread");
    }

    chatEl.innerHTML = `
      <div class="asset-info">
        <h4>Sender: ${msg.sender}</h4>
        <p>Message: ${msg.message}</p>
        <p>Time: ${new Date(msg.timestamp).toLocaleString()}</p>
        <p>Friend?: ${msg.isFriend ? "Yes" : "No"}</p>
      </div>
    `;

    chatEl.onclick = () => openChat(userId);

    tabPane.appendChild(chatEl);
  });

  tabsContent.appendChild(tabPane);
  container.appendChild(tabsContent);

  return container;
}
