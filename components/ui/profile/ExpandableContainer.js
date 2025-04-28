import { createExpandableAssetsTabs } from "./expandableAssets.js";
import { createExpandableCharactersTabs } from "./expandableCharacters.js";
import { createExpandableLoresTabs } from "./expandableLores.js";
import { createExpandableMessagesTabs } from "./expandableMessages.js";

const sectionTabCreators = {
  Assets: (data) => createExpandableAssetsTabs(data),
  Characters: (data) => createExpandableCharactersTabs(data),
  LoresNQuests: (data) => createExpandableLoresTabs(data),
  Messages: () => createExpandableMessagesTabs(),
};

export async function createExpandableContainer(containerId, jsonPath) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const res = await fetch(jsonPath);
  const data = await res.json();
  const sections = data["expandable-lists"];

  Object.entries(sections).forEach(async ([sectionName, sectionItems], index) => {
    const box = document.createElement("div");
    box.classList.add("expandable-box");

    box.innerHTML = `
      <div class="box-content">
        <h2 class="box-title">${sectionName}</h2>
        <div class="box-details">
          <p><strong>Items:</strong> ${sectionName == "Messages" ? " " : sectionItems.length}</p>
        </div>
      </div>
    `;

    box.dataset.index = index;
    container.appendChild(box);

    // Dynamically insert the correct tab component if the section is registered
    const createTabs = sectionTabCreators[sectionName];
    if (typeof createTabs === "function") {
      const tabWrapper = await Promise.resolve(createTabs(data)); // Pass full JSON
      box.appendChild(tabWrapper);
    }
  });

  const boxes = container.querySelectorAll(".expandable-box");

  boxes.forEach((box, idx) => {
    box.addEventListener("click", () => {
      boxes.forEach((b, i) => {
        b.classList.toggle("expanded", i === idx);
      });
    });
  });

  if (boxes.length > 0) {
    boxes[0].classList.add("expanded");
  }
}

