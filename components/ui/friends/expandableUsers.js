// expandableAssets.js
import { get } from "../../../utils/api.js";
import { sendFriendRequest } from "../../friends/Friends.js";
import { getState } from "../../../utils/state.js";

export async function createExpandableUsersTabs() {
  const data = await get(`/players/all`);
  console.log("Users List:", data);

  const container = document.createElement("section");
  container.className = "user-tabs";
  container.id = "users";
  container.setAttribute("data-category", "users");

  if (!Array.isArray(data)) return;

  const groups = {
    "Has Characters": data.filter(user => user.characters?.length > 0),
    "No Characters": data.filter(user => !user.characters || user.characters.length === 0),
  };

  const tabsNav = document.createElement("ul");
  tabsNav.className = "tabs-nav";

  const tabsContent = document.createElement("div");
  tabsContent.className = "tabs-content";

  Object.entries(groups).forEach(([groupName, users], index) => {
    const tabId = `tab-${groupName.replace(/\s+/g, "-").toLowerCase()}`;

    const tabButton = document.createElement("li");
    tabButton.textContent = groupName;
    tabButton.dataset.tab = tabId;
    tabButton.className = index === 0 ? "active" : "";
    tabsNav.appendChild(tabButton);

    const tabPane = document.createElement("div");
    tabPane.className = `tab-pane ${index === 0 ? "active" : ""}`;
    tabPane.id = tabId;

    users.forEach((user) => {
      const userEl = document.createElement("div");
      userEl.classList.add("user-card");
      userEl.innerHTML = `
        <img src="${user.avatarUrl}" alt="${user.monika}" class="avatar" width="64" height="64" />
        <div class="info" style="text-align: left; width: 100%; position: relative;">
          <h4>${user.monika}</h4>
          <p>Wallet: ${user.walletAddress}</p>
          <p>Points: ${user.points}</p>
          <p>Characters: ${user.characters.length}</p>
          <button class="friend-request-btn">Send Friend Request</button>
        </div>
      `;

      const button = userEl.querySelector(".friend-request-btn");
      button.addEventListener("click", async () => {
        const currentUserId = getState().user._id;
        const response = await sendFriendRequest(currentUserId, user._id);
    
        if (response.success) {
          button.innerText = "Request Sent";
          button.disabled = true;
        } else {
          alert(response.message || "Something went wrong");
        }
      });
    
      tabPane.appendChild(userEl);
    });

    tabsContent.appendChild(tabPane);
  });

  container.innerHTML += ``;
  container.appendChild(tabsNav);
  container.appendChild(tabsContent);

  // Tab switching logic
  tabsNav.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      const selectedTab = e.target.dataset.tab;

      tabsNav.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
      tabsContent.querySelectorAll(".tab-pane").forEach((pane) => pane.classList.remove("active"));

      e.target.classList.add("active");
      tabsContent.querySelector(`#${selectedTab}`)?.classList.add("active");
    }
  });

  // 🔥 Important: you return the full built component
  return container;
}
