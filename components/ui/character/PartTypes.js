/**
 * Renders the part type selector and action buttons
 * @param {HTMLElement} container - DOM container to render into
 * @param {Object} props - Props including partTypes, setPartType, and actions
 */
export function renderPartTypes(container, props) {
  container.innerHTML = ''; // Clear previous content
  container.className = "PartTypes";

  const urlPrefix = `http://127.0.0.1:5502/public/parts_icons`;

  // Create side layout container
  const side = document.createElement("div");
  side.id = "side";

  const leftColumn = document.createElement("div");
  leftColumn.classList.add("side-column", "left-column");

  const rightColumn = document.createElement("div");
  rightColumn.classList.add("side-column", "right-column");

  // Distribute part types with image into left/right columns
  props.partTypes.forEach((partType, index) => {
    const partTypeDiv = document.createElement("div");
    partTypeDiv.classList.add("partType");

    if (partType.id === props.partType) {
      partTypeDiv.classList.add("partTypeSelected");
    }

    const img = document.createElement("img");
    img.src = `${urlPrefix}/${partType.iconFilename}.png`;
    img.alt = partType.iconFilename;

    const label = document.createElement("span");
    label.textContent = partType.label;
    label.className = "partTypeLabel";

    partTypeDiv.appendChild(img);
    partTypeDiv.appendChild(label);

    partTypeDiv.addEventListener("click", () => props.setPartType(partType.id));

    if (index % 2 === 0) {
      leftColumn.appendChild(partTypeDiv);
    } else {
      rightColumn.appendChild(partTypeDiv);
    }
  });

  side.appendChild(leftColumn);
  side.appendChild(rightColumn);

  // Action buttons section
  const actionsWrapper = document.createElement("div");
  actionsWrapper.className = "actions";

  const actions = [
    { icon: "refresh", onClick: props.refresh },
    { icon: "save", onClick: props.save },
    { icon: "random", onClick: props.randomize },
    { icon: "share", onClick: props.share },
  ];

  actions.forEach(({ icon, onClick }) => {
    const actionDiv = document.createElement("div");
    actionDiv.className = "action";

    const img = document.createElement("img");
    img.src = `${urlPrefix}/${icon}.png`;
    img.alt = icon;

    actionDiv.appendChild(img);
    actionDiv.addEventListener("click", onClick);
    actionsWrapper.appendChild(actionDiv);
  });

  container.appendChild(actionsWrapper);
  container.append(side);

}
