import { createExpandableFriendsTabs } from "./expandableFriends.js";
import { createExpandableUsersTabs } from "./expandableUsers.js";
// import { createExpandableLobbiesTabs } from "./expandableLobbies.js";
import { createExpandableChatRoomsTabs } from "./expandableChatRooms.js";

const sectionTabCreators = {
  Friends: () => createExpandableFriendsTabs(),
  Users: () => createExpandableUsersTabs(),
  // Lobbies: () => createExpandableLobbiesTabs(),
  ChatRooms: () => createExpandableChatRoomsTabs(),
};

export function createExpandableContainer(containerId, sectionsToRender = ["Friends", "Users", "Lobbies", "ChatRooms"]) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID ${containerId} not found.`);
    return;
  }

  sectionsToRender.forEach(async (sectionName, index) => {
    const box = document.createElement("div");
    box.classList.add("expandable-box");
    box.dataset.index = index;

    box.innerHTML = `
      <div class="box-content">
        <h2 class="box-title">${sectionName}</h2>
        <div class="box-details"></div>
      </div>
    `;

    const detailsEl = box.querySelector(".box-details");
    const createTabs = sectionTabCreators[sectionName];

    if (typeof createTabs === "function") {
      try {
        const tabWrapper = await createTabs(); // works for both sync & async
        if (tabWrapper instanceof Node && detailsEl) {
          detailsEl.appendChild(tabWrapper);
        }
      } catch (err) {
        console.error(`Error creating tabs for ${sectionName}:`, err);
      }
    }

    container.appendChild(box);
  });

  // Handle expand/collapse behavior
  const observer = new MutationObserver(() => {
    const boxes = container.querySelectorAll(".expandable-box");
    boxes.forEach((box, idx) => {
      box.addEventListener("click", () => {
        boxes.forEach((b, i) => {
          b.classList.toggle("expanded", i === idx);
        });
      });
    });

    // Auto-expand first section
    if (boxes.length > 0) {
      boxes[0].classList.add("expanded");
    }
  });

  observer.observe(container, { childList: true });
}
