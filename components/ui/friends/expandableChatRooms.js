import socket from "../../../utils/socket.js";
import { getState } from "../../../utils/state.js";
import { reactToRoomMessage } from "../../chat/Chat.js";

export async function createExpandableChatRoomsTabs() {
  let playerId = null; // this should be set when the player logs in or joins
  if (getState().user === null || getState().user === undefined) {
    playerId = JSON.parse(localStorage.getItem("user"));
  } else {
    playerId = getState().user._id;
  }
  let selectedRoomId = null;

  // Create elements
  const container = document.createElement("section");
  container.className = "asset-tabs";

  const chatroomInput = document.createElement("input");
  chatroomInput.type = "text";
  chatroomInput.placeholder = "Enter room name";
  chatroomInput.className = "room-name-input";

  const createBtn = document.createElement("button");
  createBtn.textContent = "Create Room";
  createBtn.className = "create-room-btn";

  const roomsList = document.createElement("ul");
  roomsList.className = "rooms-list";

  const messagesList = document.createElement("div");
  messagesList.className = "messages-list";

  const messageForm = document.createElement("div");
  messageForm.className = "message-form";
  messageForm.style.display = "none"; // Hide initially

  const messageInput = document.createElement("input");
  messageInput.type = "text";
  messageInput.placeholder = "Type your message...";
  messageInput.className = "message-input";

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Send";
  sendBtn.className = "send-message-btn";

  messageForm.appendChild(messageInput);
  messageForm.appendChild(sendBtn);

  // Socket Events
  socket.on("chatroomError", (msg) => console.log(`🚫 Error: ${msg}`));

  socket.on("chatroomsUpdated", updateRoomList);
  socket.on("roomsList", updateRoomList);

  socket.on("roomMessagesFetched", ({ roomId, messages }) => {
    if (selectedRoomId === roomId) {
      handleRoomMessages(messages);
    }
  });

  socket.on("roomJoined", ({ roomId, messages }) => {
    console.log(`🎉 Joined room: ${roomId}`);
    console.log(`🎉 Messages:`, messages);
    selectedRoomId = roomId;
    handleRoomMessages(messages);
    messageForm.style.display = "flex";
  });

  socket.on("roomMessage", (data) => {
    appendMessage(data);
  });

  socket.on("roomMessageReaction", ({ messageId, emoji, userId }) => {
    const msgDiv = messagesList.querySelector(
      `[data-message-id="${messageId}"]`
    );
    if (msgDiv) {
      const reactions = msgDiv.querySelector(".reactions");
      const span = document.createElement("span");
      span.textContent = emoji;
      reactions.appendChild(span);
    }
  });

  // Event Listeners
  createBtn.addEventListener("click", () => {
    const name = chatroomInput.value.trim();
    if (name) {
      socket.emit("createChatroom", { roomName: name, createdBy: playerId });
      chatroomInput.value = "";
    }
  });

  sendBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message && selectedRoomId) {
      socket.emit("sendRoomMessage", {
        roomId: selectedRoomId,
        sender: playerId,
        message,
      });
      messageInput.value = "";
    }
  });

  messageInput.addEventListener("input", typingInRoom);

  function updateRoomList(rooms) {
    roomsList.innerHTML = "";
    rooms.forEach((room) => {
      const li = document.createElement("li");
      li.textContent = room.roomId || room.name;
      li.className = "room-item";
      li.addEventListener("click", () => {
        const roomId = room.roomId || room.name;
        socket.emit("joinChatroom", { roomName: roomId }); // match server-side
        console.log(`🟢 Requesting to join room: ${roomId}`);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-room-btn";
      deleteBtn.innerHTML = "🗑️"; // or use ❌ or 'Delete'
      deleteBtn.title = "Delete chatroom";

      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // so it doesn't trigger room select
        deleteChatroom(room.roomId);
      });

      li.appendChild(deleteBtn);
      roomsList.appendChild(li);
    });
  }

  function deleteChatroom(roomId) {
    if (!roomId) return log("⚠️ No room selected");
    socket.emit("deleteChatroom", {
      roomName: roomId,
      requestedBy: $("playerId"), // assuming this gets the ID
    });
  }

  let typingTimeout;
  function typingInRoom() {
    if (!selectedRoomId) return;
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("typingInRoom", {
        roomId: selectedRoomId,
        userId: playerId,
      });
      console.log("✍️ typingInRoom");
    }, 300); // triggers once every 300ms after typing stops
  }

  function handleRoomMessages(messages) {
    messagesList.innerHTML = "";
    messages.forEach(appendMessage);
  }

  function appendMessage(msg) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message-item";
    msgDiv.dataset.messageId = msg._id;

    const messageText = document.createElement("div");
    messageText.className = "message-text";
    messageText.innerHTML = `<strong>${msg.sender || "?"}:</strong> ${
      msg.message
    }`;

    const hoverMenu = document.createElement("div");
    hoverMenu.className = "hover-menu";
    hoverMenu.style.display = "none";
    hoverMenu.innerHTML = `
      <div class="top-actions">
        <span class="emoji" data-emoji="👍">👍</span>
        <span class="emoji" data-emoji="😂">😂</span>
        <span class="emoji" data-emoji="❤️">❤️</span>
        <span class="reply">💬 Reply</span>
        <span class="pin">📌 Pin</span>
      </div>
      <div>
        <input
          type="text"
          placeholder="Type your message..."
          class="reply-input"
          style="display: none;"
        />
        <button class="send-reply" style="display: none;">Send</button>
      </div>
    `;

    const replyInput = hoverMenu.querySelector(".reply-input");
    const sendReplyButton = hoverMenu.querySelector(".send-reply");
    replyInput.addEventListener("input", typingInRoom); // 👈 added here
    const reactionsContainer = document.createElement("div");
    reactionsContainer.className = "reactions";
    if (msg.reactions && msg.reactions.length > 0) {
      reactionsContainer.innerHTML = msg.reactions
        .map((r) => `<span>${r.emoji}</span>`)
        .join(" ");
    }

    const repliesContainer = document.createElement("div");
    repliesContainer.className = "replies hidden";
    // repliesContainer.innerHTML = `<em>No replies yet</em>`;

    msgDiv.appendChild(messageText);
    msgDiv.appendChild(hoverMenu);
    msgDiv.appendChild(reactionsContainer);
    msgDiv.appendChild(repliesContainer);
    messagesList.appendChild(msgDiv);

    msgDiv.addEventListener("mouseenter", () => {
      hoverMenu.style.display = "flex";
    });
    msgDiv.addEventListener("mouseleave", () => {
      hoverMenu.style.display = "none";
    });

    hoverMenu.querySelectorAll(".emoji").forEach((emojiEl) => {
      emojiEl.addEventListener("click", () => {
        const emoji = emojiEl.dataset.emoji;
        const userId = getState().user._id;
        reactToRoomMessage(msg._id, emoji, userId);
      });
    });

    // 👉 Reply toggle logic
    hoverMenu.querySelector(".reply").addEventListener("click", () => {
      const isVisible = replyInput.style.display === "inline-block";
      replyInput.style.display = isVisible ? "none" : "inline-block";
      sendReplyButton.style.display = isVisible ? "none" : "inline-block";
      repliesContainer.classList.remove("hidden");
    });

    sendReplyButton.addEventListener("click", () => {
      const replyMessage = replyInput.value.trim();
      if (!replyMessage) return;

      const user = getState().user;
      const replyData = {
        replyTo: msg._id,
        sender: user.username,
        message: replyMessage,
        userId: user._id,
      };

      socket.emit("replyToRoomMessage", replyData);

      replyInput.value = "";

      const replyDiv = document.createElement("div");
      replyDiv.className = "reply-item";
      replyDiv.innerHTML = `<strong>${replyData.userId}:</strong> ${replyData.message}`;
      if (repliesContainer.innerHTML.includes("No replies yet")) {
        repliesContainer.innerHTML = "";
      }
      repliesContainer.appendChild(replyDiv);
    });
  }

  // Append everything
  container.appendChild(chatroomInput);
  container.appendChild(createBtn);
  container.appendChild(roomsList);
  container.appendChild(messagesList);
  container.appendChild(messageForm);

  return container;
}
