// src/friends/addFriend.js
const API_BASE_URL = "http://localhost:4000"; // Your backend base URL

export async function sendFriendRequest(requesterId, recipientId) {
  const res = await fetch(`${API_BASE_URL}/api/friends/send-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requesterId, recipientId }),
  });
  return await res.json();
}

export async function getPendingFriendRequests(recipientId) {
  const res = await fetch(`${API_BASE_URL}/api/friends/pending/${recipientId}`);
  return await res.json();
}


export async function acceptFriendRequest(requesterId, recipientId) {
  const res = await fetch(`${API_BASE_URL}/api/friends/accept-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requesterId, recipientId }),
  });
  return await res.json();
}

export async function rejectFriendRequest(requesterId, recipientId) {
  const res = await fetch(`${API_BASE_URL}/api/friends/reject-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requesterId, recipientId }),
  });
  return await res.json();
}


export async function getFriends(playerId) {
  const res = await fetch(`${API_BASE_URL}/api/friends/${playerId}/friends`);
  return await res.json();
}

export async function removeFriend(requesterId, recipientId) {
  const res = await fetch(`${API_BASE_URL}/api/friends/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requesterId, recipientId }),
  });
  return await res.json();
}

export async function searchFriends(query, searcherId) {
  const res = await fetch(`${API_BASE_URL}/api/friends/search?q=${encodeURIComponent(query)}&searcherId=${searcherId}`);
  return await res.json();
}

