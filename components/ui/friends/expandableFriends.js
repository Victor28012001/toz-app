import {
  getFriends,
  getPendingFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../../friends/Friends.js";
import { getState } from "../../../utils/state.js";
import { openChat } from "../chat/chatUI.js";

export async function createExpandableFriendsTabs() {
  const playerId = getState().user._id;

  const container = document.createElement("section");
  container.className = "Friend-tabs";
  container.id = "friends";
  container.setAttribute("data-category", "friends");

  container.innerHTML = `
    <div class="tabs-content">
      <div id="friend-requests" class="friend-requests mb-4"></div>
      <div id="friends-list" class="friends-list"></div>
    </div>
  `;

  // 🔔 Fetch and display pending friend requests
  const { pendingRequests } = await getPendingFriendRequests(playerId);
  const requestsContainer = container.querySelector("#friend-requests");

  if (pendingRequests.length === 0) {
    requestsContainer.innerHTML = `<p>No pending friend requests.</p>`;
  } else {
    requestsContainer.innerHTML = `<h3 class="mb-2 font-semibold">Friend Requests</h3>`;

    pendingRequests.forEach((req) => {
      const card = document.createElement("div");
      card.className = "friend-request-card";

      card.innerHTML = `
        <img src="${req.requester.avatarUrl}" alt="${req.requester.monika}" width="40" class="avatar" />
        <span class="name">${req.requester.monika}</span>
        <button class="accept-btn">Accept</button>
        <button class="reject-btn">Reject</button>
      `;

      const acceptBtn = card.querySelector(".accept-btn");
      const rejectBtn = card.querySelector(".reject-btn");

      acceptBtn.addEventListener("click", async () => {
        await acceptFriendRequest(req.requester._id, playerId);
        card.remove();
      });

      rejectBtn.addEventListener("click", async () => {
        await rejectFriendRequest(req.requester._id, playerId);
        card.remove();
      });

      requestsContainer.appendChild(card);
    });
  }

  // 👥 Fetch and display friends list
  const friendss = await getFriends(playerId);
  const friendsListEl = container.querySelector("#friends-list");

  const friends = friendss.friends;
  if (!friends || friends.length === 0) {
    friendsListEl.innerText = "No friends found.";
  } else {
    friends.forEach((friend) => {
      const friendEl = document.createElement("div");
      friendEl.classList.add("friend-user");
      friendEl.style.padding = "4px";
      friendEl.style.marginBottom = "2px";
      friendEl.style.cursor = "pointer";
      friendEl.style.borderRadius = "4px";
      friendEl.innerText = `${friend.monika}`;
      friendEl.onclick = () => {
        // console.log("Opening chat with:", friend._id, friend.monika, friend.avatarUrl);
        openChat(friend._id, friend.monika, friend.avatarUrl);
      };
      friendsListEl.appendChild(friendEl);
    });
  }

  return container;
}
