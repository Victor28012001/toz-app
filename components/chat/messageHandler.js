// src/chat/messageHandler.js
const API_BASE_URL = "http://localhost:4000"; // Your backend base URL

export async function fetchRecentMessages(playerId) {
  const res = await fetch(`${API_BASE_URL}/messages/recent/${playerId}`);
  return await res.json();
}

// Send a message
export async function sendMessage(senderId, recipientId, message) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chat/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ senderId, recipientId, message }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  } catch (err) {
    console.error("Error sending message:", err.message);
    return null;
  }
}

// Get chat history between two players
export async function getChatHistory(senderId, recipientId) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/chat/history/${senderId}/${recipientId}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  } catch (err) {
    console.error("Error fetching chat history:", err.message);
    return [];
  }
}

// Mark message as read
export async function markMessageAsRead(senderId, recipientId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chat/mark-as-read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ senderId, recipientId }),
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error || "Failed to mark messages as read");
    return data;
  } catch (err) {
    console.error("Error marking messages as read:", err.message);
    return null;
  }
}

// Get all user messages (inbox)
export async function getUserMessages(userId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chat/user-messages/${userId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  } catch (err) {
    console.error("Error fetching user messages:", err.message);
    return [];
  }
}
